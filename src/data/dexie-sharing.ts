import { useLiveQuery } from "dexie-react-hooks";
import { db } from "./dexie-db";
import { getTiedRealmId } from "dexie-cloud-addon";
import { MyDexieCloudFriend, ShoppingList } from "./types";


export const useLiveShoppingLists = (): ShoppingList[] | undefined => {
  const shoppingLists = useLiveQuery(async () => {
    return await db.shoppingLists.toArray();
  })

  return shoppingLists;
}


export const useLiveShoppingList = (shoppingListId?: string): ShoppingList | undefined => {
  const shoppingList = useLiveQuery(async () => {
    if (!shoppingListId) {
      return undefined;
    }
    return await db.shoppingLists.get({ id: shoppingListId });
  })

  return shoppingList;
}


export const getFriendsWithAccessToShoppingList = async (shoppingListId: string): Promise<MyDexieCloudFriend[]> => {
  const shoppingList = await db.shoppingLists.get({ id: shoppingListId });

  const shoppingListRealmId = shoppingList?.realmId;

  if (!shoppingListRealmId) {
    throw new Error("Shopping list realmId not found");
  }

  const shoppingListSharedWith = await db
    .members
    .where('realmId')
    .equals(shoppingListRealmId)
    .toArray();

  const friendsWithAccess = await db
    .myFriends
    .where('id')
    .anyOf(shoppingListSharedWith.map((member) => member.email ?? ''))
    .toArray();

  return friendsWithAccess;
}


export const shareShoppingList = async (shoppingListId: string, friendEmails: string[]) => {

  console.info("DB: shareShoppingList", shoppingListId, friendEmails);

  // Do a sync-consistent transaction that moves the space and its cards into a new realm
  // See http://dexie.org/cloud/docs/consistency
  return db.transaction(
    'rw',
    [db.shoppingLists, db.myFriends, db.realms, db.members],
    async () => {

      const shoppingList = await db.shoppingLists.get({ id: shoppingListId });

      console.log("FRIEND EMAILS", friendEmails);

      console.log("DB: shareShoppingList in transaction", shoppingListId, shoppingList);
      const friends = await db
        .myFriends
        .where('email')
        .anyOf(friendEmails)
        .toArray();

      console.log("DB: shareShoppingList in transaction - 2", shoppingListId, friends);

      if (!shoppingList) {
        throw new Error("Shopping list not found");
      }

      const realmId = getTiedRealmId(shoppingListId);

      // Create a realm for the shared list. Use put to not fail if it already exists.
      // (Sync consistency)
      db.realms.put({
        realmId,
        name: shoppingList.name,
        represents: `A shopping list for ${shoppingList.name}`,
      })

      db.shoppingLists.update(shoppingList, { realmId });

      console.log("DB: shareShoppingList - sending invite to friends", shoppingListId, friends);

      if (friends.length > 0) {
        db.members.bulkAdd(
          friends.map((friend) => ({
            realmId,
            email: friend.email,
            invite: true,
            permissions: {
              manage: '*', // Give your friend full permissions within this new realm.
            },
          })),
        )
      }
    },
  )
}


export const unshareShoppingListFromFriends = async (shoppingListId: string, friendIds: string[]) => {
  const shoppingList = await db.shoppingLists.get({ id: shoppingListId });

  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }

  const realmId = shoppingList.realmId || ''

  const friends = await db.myFriends.where('id').anyOf(friendIds).toArray();

  return db
    .members
    .where('[email+realmId]')
    .anyOf(
      friends.map(
        (friend) => [friend.email ?? '', realmId] as [string, string],
      ),
    )
    .delete()
}


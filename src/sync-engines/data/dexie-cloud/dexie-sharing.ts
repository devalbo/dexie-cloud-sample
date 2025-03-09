import { useLiveQuery } from "dexie-react-hooks";
import { dexieDb } from "./dexie-db";
import { getTiedRealmId } from "dexie-cloud-addon";
import { MyCloudFriend, ShoppingList, ShoppingListItem } from "~/data/common-types";


export const useLiveShoppingLists = (): ShoppingList[] | undefined => {
  const shoppingLists = useLiveQuery(async () => {
    return await dexieDb.shoppingLists.toArray();
  })

  return shoppingLists;
}


export const useLiveShoppingList = (shoppingListId?: string): ShoppingList | undefined => {
  const shoppingList = useLiveQuery(async () => {
    if (!shoppingListId) {
      return undefined;
    }
    return await dexieDb.shoppingLists.get({ id: shoppingListId });
  }, [shoppingListId])

  return shoppingList;
}


export const useLiveShoppingListItems = (shoppingListId?: string): ShoppingListItem[] | undefined => {
  // const shoppingList = useLiveShoppingList(shoppingListId);

  const shoppingListItems = useLiveQuery(async () => {
    if (!shoppingListId) {
      return [];
    }
    return await dexieDb
      .shoppingListItems
      .where('shoppingListId')
      .equals(shoppingListId)
      .toArray();
  }, [shoppingListId])

  return shoppingListItems;
}


export const getFriendsWithAccessToShoppingList = async (shoppingListId: string): Promise<MyCloudFriend[]> => {
  const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

  const shoppingListRealmId = shoppingList?.realmId;

  if (!shoppingListRealmId) {
    throw new Error("Shopping list realmId not found");
  }

  const shoppingListSharedWith = await dexieDb
    .members
    .where('realmId')
    .equals(shoppingListRealmId)
    .toArray();

  const friendsWithAccess = await dexieDb
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
  return dexieDb.transaction(
    'rw',
    [dexieDb.shoppingLists, dexieDb.myFriends, dexieDb.realms, dexieDb.members],
    async () => {

      const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

      console.log("FRIEND EMAILS", friendEmails);

      console.log("DB: shareShoppingList in transaction", shoppingListId, shoppingList);
      const friends = await dexieDb
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
      dexieDb.realms.put({
        realmId,
        name: shoppingList.name,
        represents: `A shopping list for ${shoppingList.name}`,
      })

      dexieDb.shoppingLists.update(shoppingList, { realmId });

      console.log("DB: shareShoppingList - sending invite to friends", shoppingListId, friends);

      if (friends.length > 0) {
        dexieDb.members.bulkAdd(
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
  const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }

  const realmId = shoppingList.realmId || ''

  const friends = await dexieDb.myFriends.where('id').anyOf(friendIds).toArray();

  return dexieDb
    .members
    .where('[email+realmId]')
    .anyOf(
      friends.map(
        (friend) => [friend.email ?? '', realmId] as [string, string],
      ),
    )
    .delete()
}


export const renameShoppingList = async (shoppingListId: string, newName: string) => {
  const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }

  dexieDb.shoppingLists.update(shoppingList, { name: newName });
}


export const addShoppingListItem = async (
  shoppingListId: string,
  itemName: string,
  itemPrice: number,
  addedBy: string
) => {
  const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }

  const newItem: ShoppingListItem = {
    name: itemName,
    price: itemPrice,
    shoppingListId: shoppingListId,
    addedBy: addedBy,
    realmId: shoppingList.realmId,
  }

  await dexieDb.shoppingListItems.add(newItem);

}
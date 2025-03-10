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


export const useLiveFriendsWithAccessToShoppingList = (shoppingListId: string): MyCloudFriend[] | undefined => {

  const friendsWithAccess = useLiveQuery(async () => {
    const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

    const shoppingListRealmId = shoppingList?.realmId;

    if (!shoppingListRealmId) {
      throw new Error("Shopping list realmId not found");
    }

    const shoppingListSharedWithMembers = await dexieDb
      .members
      .where('realmId')
      .equals(shoppingListRealmId)
      .toArray();

    const shoppingListSharedWithEmails = shoppingListSharedWithMembers
      .filter((member) => member.email)
      .map((member) => member.email!);

    const allFriends = await dexieDb.myFriends.toArray();

    console.log("SHOPPING LIST REALM ID", shoppingListRealmId);
    console.log("SHOPPING LIST SHARED WITH", shoppingListSharedWithEmails);
    console.log("ALL FRIENDS", allFriends);

    const friendsWithAccess = await dexieDb
      .myFriends
      .where('email')
      .anyOf(shoppingListSharedWithEmails)
      .toArray();

    return friendsWithAccess;
  })

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


export const unshareShoppingListFromFriends = async (shoppingListId: string, friendEmails: string[]) => {
  const shoppingList = await dexieDb.shoppingLists.get({ id: shoppingListId });

  if (!shoppingList) {
    throw new Error("Shopping list not found");
  }

  const realmId = shoppingList.realmId;

  const allFriends = await dexieDb
    .myFriends
    .where('email')
    .anyOf(friendEmails)
    .toArray()

  const allFriendsEmails = allFriends.map((friend) => friend.email!);

  const toDelete = await dexieDb
    .members
    .where('[email+realmId]')
    .anyOf(
      allFriendsEmails.map(
        (friendEmail) => [friendEmail, realmId] as [string, string],
      ),
    )

  console.log("TO DELETE", toDelete);

  const deletedMembers = await dexieDb
    .members
    .where('[email+realmId]')
    .anyOf(
      allFriendsEmails.map(
        (friendEmail) => [friendEmail, realmId] as [string, string],
      ),
    )
    .delete()

  return deletedMembers;
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


export const deleteShoppingList = async (idToDelete: string) => {
  await dexieDb.shoppingLists.delete(idToDelete as any);
}


export const deleteShoppingListItem = async (itemId: string) => {
  await dexieDb.shoppingListItems.delete(itemId as any);
}

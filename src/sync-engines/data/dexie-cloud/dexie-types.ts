import Dexie from "dexie"
import { Table } from "dexie"
import { UserLogin } from "dexie-cloud-addon"
import { MyCloudFriend, ShoppingList, ShoppingListItem, AppSyncEngineContextType } from "~/data/common-types"


// export interface DexieCloudAppContextType {
//   myDexieCloudUser: UserLogin | null
//   setMyDexieCloudUser: (user: UserLogin | null) => void
// }

export type DexieCloudAppContextType = AppSyncEngineContextType<UserLogin>


type ShoppingListDbTables = {
  myFriends: Table<MyCloudFriend, "id">
  shoppingLists: Table<ShoppingList, "id">
  shoppingListItems: Table<ShoppingListItem, "id">
};

export type DexieShoppingListDb = Dexie & ShoppingListDbTables;

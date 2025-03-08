import Dexie from "dexie"
import { Table } from "dexie"
import { UserLogin } from "dexie-cloud-addon"


export interface AppContextType {
  myDexieCloudUser: UserLogin | null
  setMyDexieCloudUser: (user: UserLogin | null) => void
}

export interface MyDexieCloudFriend {
  id?: string
  email: string
}


export interface ShoppingList {
  id?: string
  name: string
  author: string
  isActive: boolean

  createdAt: Date
  sharedWith: string[]
  realmId?: string
}

export interface ShoppingListItem {
  id?: string
  name: string
  price: number
  addedBy: string
  shoppingListId: string
}



type ShoppingListDbTables = {
  myFriends: Table<MyDexieCloudFriend, "id">
  shoppingLists: Table<ShoppingList, "id">
  shoppingListItems: Table<ShoppingListItem, "id">
};

export type ShoppingListDb = Dexie & ShoppingListDbTables;

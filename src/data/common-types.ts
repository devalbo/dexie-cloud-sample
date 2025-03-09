import { UserLogin } from "dexie-cloud-addon"

export interface MyCloudFriend {
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
  realmId?: string
}

export interface CloudNotification {
  id?: string
  message: string
  from: string
  to: string
  createdAt: Date
}

export interface CloudUser {
  id?: string
  email?: string
  isLoggedIn: boolean
  notifications: CloudNotification[]
}


export type NoAuthUser = CloudUser

export type CloudSyncEngine = 'dexie-cloud' | 'tinybase' | null



// export type SyncEngineContext = {
//   activeCloudSyncEngine: CloudSyncEngine

//   dexieCloud: AppContextType<'dexie-cloud', UserLogin> | null
//   tinybase: AppContextType<'tinybase', NoAuthUser> | null
// }



// Define the context type
export type AppSyncEngineContextType<T> = {
  syncEngine: CloudSyncEngine
  cloudUser: CloudUser | null;
  syncEngineCloudUser: T | null;
  setSyncEngineCloudUser: (user: T | null) => void;
}


// export type AppContextType<CloudSyncEngine, T> = {
//   syncEngine: CloudSyncEngine
//   cloudUser: CloudUser | null;
  
//   syncEngineCloudUser: T | null;
//   setSyncEngineCloudUser: (user: T | null) => void;
// }


export type AllSyncEnginesContext = {
  activeCloudSyncEngine: CloudSyncEngine

  dexieCloud: AppSyncEngineContextType<UserLogin> | null
  tinybase: AppSyncEngineContextType<NoAuthUser> | null
}


export type AppUserSyncContextType = {
  activeCloudSyncEngine: CloudSyncEngine
  cloudUser: CloudUser | null;
}

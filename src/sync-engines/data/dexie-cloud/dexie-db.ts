import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { DEXIE_CLOUD_DATABASE_URL } from "./dexie-config";
import { DexieShoppingListDb } from "./dexie-types";


export const dexieDb = new Dexie("ShoppingListDb", {addons: [dexieCloud]}) as DexieShoppingListDb;

dexieDb.version(3).stores({
  myFriends: "@id, email",
  shoppingLists: "@id, name",
  shoppingListItems: "@id, name, price, shoppingListId"
})


dexieDb.cloud.configure({
  databaseUrl: DEXIE_CLOUD_DATABASE_URL,
  requireAuth: true,
  customLoginGui: false,
  tryUseServiceWorker: true,
  periodicSync: {
    minInterval: 1000,
  }
});



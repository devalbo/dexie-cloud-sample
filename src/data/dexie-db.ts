import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { DEXIE_CLOUD_DATABASE_URL } from "./dexie-config";
import { ShoppingListDb } from "./types";


export const db = new Dexie("ShoppingListDb", {addons: [dexieCloud]}) as ShoppingListDb;

db.version(3).stores({
  myFriends: "@id, email",
  shoppingLists: "@id, name",
  shoppingListItems: "@id, name, price, shoppingListId"
})


db.cloud.configure({
  databaseUrl: DEXIE_CLOUD_DATABASE_URL,
  requireAuth: true,
  customLoginGui: false,
  tryUseServiceWorker: true,
  periodicSync: {
    minInterval: 1000,
  }
});



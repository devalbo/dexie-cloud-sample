import { useLiveQuery } from "dexie-react-hooks"
import { dexieDb } from "../sync-engines/data/dexie-cloud/dexie-db"
import { useEffect, useState } from "react";
import { ShoppingListManager } from "../components/shopping-list-manager";
import { useAppContext } from "~/app/app-layout";


// Main App component with shopping list functionality
export const ShoppingListDemoPage = () => {

  const [activeShoppingListId, setActiveShoppingListId] = useState<string | null>(null);

  // Live query to retrieve shopping lists from the Dexie database
  const shoppingLists =
    useLiveQuery(() => {
      try {
        return dexieDb.shoppingLists.toArray();
      } catch (e) {
        console.error("Error querying shopping lists:", e);
      }
      return [];
    }) || [];

  useEffect(() => {
    if (shoppingLists.length > 0) {
      setActiveShoppingListId(shoppingLists[0].id!);
    }
  }, [shoppingLists]);

  const appContext = useAppContext(); // Get the context
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  
  const { myDexieCloudUser } = appContext; // Destructure safely

  if (!myDexieCloudUser) {
    return (
      <div>
        Please login to Dexie Cloud to use the shopping list.
      </div>
    )
  }
  
  
  return (
    <>
      <h1>Cloud Shopping List Demo</h1>

      <ShoppingListManager 
        myDexieCloudUser={myDexieCloudUser}
        activeShoppingListId={activeShoppingListId} 
        setActiveShoppingListId={setActiveShoppingListId} 
      />
    </>
  )
}

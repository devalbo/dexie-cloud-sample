import { useLiveQuery } from "dexie-react-hooks";
import { UserLogin } from "dexie-cloud-addon";
import { ShoppingListSummary } from "./shopping-list-summary";
import { ShoppingList } from "~/data/types";
import { db } from "~/data/dexie-db";


interface ShoppingListManagerProps {
  myDexieCloudUser: UserLogin
  activeShoppingListId: string | null
  setActiveShoppingListId: (id: string | null) => void
}

export const ShoppingListManager = ({
  myDexieCloudUser, 
  activeShoppingListId,
  setActiveShoppingListId
}: ShoppingListManagerProps) => {

  const shoppingLists = useLiveQuery(() => {
    return db.shoppingLists.toArray();
  }, [activeShoppingListId]);


  return (
    <>
    <div>
      {
        shoppingLists?.map((list: ShoppingList) => (
          <ShoppingListSummary key={list.id} list={list} />
        ))
      }
    </div>
    
    <div>
      <button onClick={async () => {
        const newShoppingListName = prompt("Enter the name of the new shopping list:");
        
        if (!newShoppingListName) {
          console.error("No name provided for new shopping list.");
          return;
        }
        
        const newShoppingList = {
          name: newShoppingListName,
          author: myDexieCloudUser.email || "",
          isActive: true,
          createdAt: new Date(),
          sharedWith: [],
        }
        
        const newShoppingListId = await db.shoppingLists.add(newShoppingList)
        setActiveShoppingListId(newShoppingListId)
      }}>Add New List</button>

      <button onClick={async () => {
        await db.shoppingLists.clear();
      }}>Clear All Lists</button>
    </div>
  </>
   )
}
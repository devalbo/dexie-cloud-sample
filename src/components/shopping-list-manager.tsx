import { useLiveQuery } from "dexie-react-hooks";
import { UserLogin } from "dexie-cloud-addon";
import { ShoppingListSummary } from "./shopping-list-summary";
import { ShoppingList } from "~/data/common-types";
import { dexieDb } from "~/sync-engines/data/dexie-cloud/dexie-db";


interface ShoppingListManagerProps {
  cloudUser: UserLogin
  activeShoppingListId: string | null
  setActiveShoppingListId: (id: string | null) => void
}

export const ShoppingListManager = ({
  cloudUser,
  activeShoppingListId,
  setActiveShoppingListId
}: ShoppingListManagerProps) => {

  const shoppingLists = useLiveQuery(() => {
    return dexieDb.shoppingLists.toArray();
  }, [activeShoppingListId]);


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '100%',
      alignItems: 'center',
    }}>
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
            author: cloudUser.email || "",
            isActive: true,
            createdAt: new Date(),
            sharedWith: [],
          }
          
          const newShoppingListId = await dexieDb.shoppingLists.add(newShoppingList)
          setActiveShoppingListId(newShoppingListId)
        }}>
          Add New List
        </button>

        <button onClick={async () => {
          await dexieDb.shoppingLists.clear();
        }}>
          Clear All Lists
        </button>
      </div>
    </div>
  )
}
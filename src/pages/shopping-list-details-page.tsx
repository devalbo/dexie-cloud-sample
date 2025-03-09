import { useParams } from "react-router-dom";
import { addShoppingListItem, useLiveShoppingList, useLiveShoppingListItems } from "~/sync-engines/data/dexie-cloud/dexie-sharing";
import { ShoppingListItemComponent } from "~/components/shopping-list-item";
import { ShoppingListItem } from "~/data/common-types";
import { useAppUserSyncContext } from "~/app/app-user-sync-context";
import { dexieDb } from "~/sync-engines/data/dexie-cloud/dexie-db";


export const ShoppingListDetailsPage = () => {
  const { shoppingListId } = useParams();

  const { cloudUser } = useAppUserSyncContext();

  const shoppingList = useLiveShoppingList(shoppingListId);
  const shoppingListItems = useLiveShoppingListItems(shoppingListId);

  return (
    <>
      <h1>{shoppingList?.name}</h1>
      {
        shoppingListItems && shoppingListItems.length > 0 ? (
          shoppingListItems.map((item) => (
            <ShoppingListItemComponent key={item.id} item={item} />
          ))
        ) : (
          <div>No items</div>
        )
      }

      <button onClick={async () => {
        const itemName = prompt("Enter the name of the item");
        if (!itemName) {
          return;
        }

        const addedBy = cloudUser?.email ?? "";

        await addShoppingListItem(shoppingListId!, itemName, 10, addedBy);
        console.log("shoppingListItems", shoppingListItems);
      }}>Add Item</button>
    </>
  );
};

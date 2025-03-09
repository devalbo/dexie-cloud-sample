import { useParams } from "react-router-dom";
import { addShoppingListItem, useLiveShoppingList, useLiveShoppingListItems } from "~/sync-engines/data/dexie-cloud/dexie-sharing";
import { ShoppingListItemComponent } from "~/components/shopping-list-item";
import { useAppUserSyncContext } from "~/app/app-user-sync-context";


export const ShoppingListDetailsPage = () => {
  const { shoppingListId } = useParams();

  const { cloudUser } = useAppUserSyncContext();

  const shoppingList = useLiveShoppingList(shoppingListId);
  const shoppingListItems = useLiveShoppingListItems(shoppingListId);

  const doAddItem = async () => {
    const itemName = prompt("Enter the name of the item");
    if (!itemName) {
      return;
    }

    const addedBy = cloudUser?.email ?? "";

    await addShoppingListItem(shoppingListId!, itemName, 10, addedBy);
  }


  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '400px',
    }}>
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

      <button onClick={doAddItem}>Add Item</button>
    </div>
  );
};

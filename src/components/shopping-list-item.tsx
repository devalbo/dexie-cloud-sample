import { ShoppingListItem } from "~/data/common-types";
import { deleteShoppingListItem } from "~/sync-engines/data/dexie-cloud/dexie-sharing";


export const ShoppingListItemComponent = ({ item }: { item: ShoppingListItem }) => {

  const doDeleteItem = async () => {
    if (!item.id) {
      return;
    }
    await deleteShoppingListItem(item.id);
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }}>
      <div> {item.name} @ {item.price} </div>
      <div>
        <button onClick={doDeleteItem}>X</button>
      </div>
    </div>
  )
}

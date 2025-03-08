import { useLiveQuery } from "dexie-react-hooks"
import { db } from "~/data/dexie-db"
import { ShoppingListItem } from "~/data/common-types"



export const ShoppingListItemComponent = ({ id, name, price }: ShoppingListItem) => {
  return (
    <li key={id}>{name} - {price}</li>
  )
}


export const ShoppingListComponent = ({ shoppingListId }: { shoppingListId?: string }) => {

  console.log("shoppingListId", shoppingListId)

  const shoppingList = useLiveQuery(() => {
    if (!shoppingListId) {
      return undefined;
    }
    return db.shoppingLists.get({ id: shoppingListId });
  }, [shoppingListId]);

  const shoppingListItems = useLiveQuery(() => {
    if (!shoppingListId) {
      return [];
    }

    return db.shoppingListItems
      .where("shoppingListId")
      .equals(shoppingListId)
      .toArray();
  });

  if (!shoppingList) {
    return (
      <div>
        <h3>No shopping list selected</h3>
      </div>
    );
  }

  return (
    <div>
      <h3>Shopping List - {shoppingList.name}</h3>
      <p>Created by {shoppingList.author}</p>
      <ul>
        {shoppingListItems?.map((item) => (
          <ShoppingListItemComponent key={item.id} {...item} />
        ))}
      </ul>
    </div>
  );
}
import { ShoppingListItem } from "~/data/common-types";


export const ShoppingListItemComponent = ({ item }: { item: ShoppingListItem }) => {
  return (
    <>
      <div> {item.name} @ {item.price} </div>
    </>
  )
}

import { useParams } from "react-router-dom";
import { ShoppingListAccessComponent } from '~/components/shopping-list-access';


export const ShoppingListSharingPage = () => {
  const { shoppingListId } = useParams();
  
  // const shoppingList = useLiveQuery(() => {
  //   if (!shoppingListId) {
  //     return undefined;
  //   }

  //   return db.shoppingLists.get({ id: shoppingListId });
  // }, [shoppingListId]);

  return (
    // <div style={{
    //   display: 'flex',
    //   flexDirection: 'column',
    //   gap: '1rem',
    //   width: '600px',
    //   margin: '0 auto',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // }}>
    <>
      {/* <h1>{shoppingList?.name}</h1> */}
      <ShoppingListAccessComponent
        shoppingListId={shoppingListId!}
      />
    </>
  );
};

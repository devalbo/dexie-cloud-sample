import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";
import { db } from "~/data/dexie-db";
import { ShoppingListAccessComponent } from '~/components/shopping-list-access';
import { useState } from "react";


export const ShoppingListDetailsPage = () => {
  const { shoppingListId } = useParams();

  const [view, setView] = useState<'sharing' | 'items'>('items');

  
  const shoppingList = useLiveQuery(() => {
    if (!shoppingListId) {
      return undefined;
    }

    return db.shoppingLists.get({ id: shoppingListId });
  }, [shoppingListId]);

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
      <h1>{shoppingList?.name}</h1>
      <div>
        <label>
          <input 
            type="radio" 
            name="view" 
            value="items" 
            checked={view === 'items'}
            onChange={() => setView('items')}
          />
          Items
        </label>
        <label>
          <input 
            type="radio" 
            name="view" 
            value="sharing" 
            checked={view === 'sharing'}
            onChange={() => setView('sharing')}
          />
          Sharing
        </label>
      </div>
      {view === 'sharing' && (
        <ShoppingListAccessComponent
          shoppingListId={shoppingListId!}
        />
      )}
      {view === 'items' && <div style={{ textAlign: 'center' }}>Items</div>}
    </>
  );
};

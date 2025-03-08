import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";
import { dexieDb } from "~/sync-engines/data/dexie-cloud/dexie-db";
import { ShoppingListAccessComponent } from '~/components/shopping-list-access';
import { useState } from "react";


export const ShoppingListDetailsPage = () => {
  const { shoppingListId } = useParams();

  const [view, setView] = useState<'sharing' | 'items'>('items');

  
  const shoppingList = useLiveQuery(() => {
    if (!shoppingListId) {
      return undefined;
    }

    return dexieDb.shoppingLists.get({ id: shoppingListId });
  }, [shoppingListId]);

  return (
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

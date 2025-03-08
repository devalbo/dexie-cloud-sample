import React from 'react';
import { Link } from 'react-router-dom';
import { dexieDb } from '~/sync-engines/data/dexie-cloud/dexie-db';
import { ShoppingList } from '~/data/common-types';

interface ShoppingListSummaryProps {
  list: ShoppingList;
}

export const ShoppingListSummary: React.FC<ShoppingListSummaryProps> = ({ list }) => {
  return (
    <>
      <Link to={`/lists/${list.id}`}>
        <h5>{list.name}</h5>
      </Link>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
      }}>
        <Link to={`/lists/${list.id}/share`} style={{ textDecoration: 'none' }}>
          <button>Share</button>
        </Link>
        <button onClick={ async () => {
          const idToDelete = list.id;
          if (!idToDelete) {
            return;
          }
          const areYouSure = confirm("Are you sure you want to delete this list?");
          if (areYouSure) {
            await dexieDb.shoppingLists.delete(idToDelete as any);
          }
        }}>Delete</button>
      </div>
    </>
  );
};

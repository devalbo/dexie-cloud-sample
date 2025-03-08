import React from 'react';
import { Link } from 'react-router-dom';
import { db } from '~/data/dexie-db';
import { ShoppingList } from '~/data/types';

interface ShoppingListSummaryProps {
  list: ShoppingList;
}

export const ShoppingListSummary: React.FC<ShoppingListSummaryProps> = ({ list }) => {
  return (
    // <div style={{
    //   flex: 1,
    //   display: 'flex',
    //   flexDirection: 'row',
    //   justifyContent: 'space-between',
    //   alignItems: 'center',
    //   justifyItems: 'center',
    //   padding: '10px',
    //   border: '1px solid #ccc',
    //   borderRadius: '5px',
    //   minWidth: '400px',
    //   maxHeight: '30px',
    // }}>
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
            await db.shoppingLists.delete(idToDelete as any);
          }
        }}>Delete</button>
      </div>
    </>
  );
};

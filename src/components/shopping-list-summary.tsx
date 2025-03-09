import { Link } from 'react-router-dom';
import { dexieDb } from '~/sync-engines/data/dexie-cloud/dexie-db';
import { ShoppingList } from '~/data/common-types';
import { renameShoppingList } from '~/sync-engines/data/dexie-cloud/dexie-sharing';

interface ShoppingListSummaryProps {
  list: ShoppingList;
}

export const ShoppingListSummary = ({ list }: ShoppingListSummaryProps) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      gap: '10px',
      width: '400px',
      alignItems: 'center',
      // border: '1px solid red',

      // justifyContent: 'space-between',
    }}>
      <Link to={`/lists/${list.id}`}>
        <h5>{list.name}</h5>
      </Link>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '10px',
        // width: '100%',
        marginLeft: 'auto',
      }}>
        <button onClick={() => {
          // navigator.clipboard.writeText(`${window.location.origin}/lists/${list.id}`);
          if (!list.id) {
            return;
          }
          const newName = prompt("Enter a new name");
          if (!newName) {
            return;
          }
          renameShoppingList(list.id, newName);
        }}>
          Rename
        </button>
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
    </div>
  );
};

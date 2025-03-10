import { useLiveQuery } from 'dexie-react-hooks';
import { dexieDb } from '~/sync-engines/data/dexie-cloud/dexie-db';
import { shareShoppingList, unshareShoppingListFromFriends, useLiveFriendsWithAccessToShoppingList } from '~/sync-engines/data/dexie-cloud/dexie-sharing';


interface ShoppingListAccessComponentProps {  
  shoppingListId: string;
}

export const ShoppingListAccessComponent = ({ shoppingListId }: ShoppingListAccessComponentProps) => {

  const allMyFriends = useLiveQuery(() => dexieDb.myFriends.toArray()) ?? [];
  const shoppingList = useLiveQuery(() => dexieDb.shoppingLists.get({id: shoppingListId}));

  const friendsWithAccess = useLiveFriendsWithAccessToShoppingList(shoppingListId);
  const friendsWithAccessEmails = friendsWithAccess?.map((friend) => friend.email!) ?? [];


  const doShare = async (friendEmail: string) => {
    await shareShoppingList(shoppingListId, [friendEmail]);
  };

  const doUnshare = async (friendEmail: string) => {
    await unshareShoppingListFromFriends(shoppingListId, [friendEmail]);
  };


  return (
    <div>
      <h2>Share {shoppingList?.name}</h2>

      <div>
        {allMyFriends.map((friend) => (
          <div key={friend.id}>
            <h3>{friend.email}</h3>
            <label>
              <input
                type="radio"
                checked={friendsWithAccessEmails.includes(friend.email!)}
                onChange={() => doShare(friend.email)}
              />
              Shared
            </label>
            <label>
              <input
                type="radio"
                checked={!friendsWithAccessEmails.includes(friend.email!)}
                onChange={() => doUnshare(friend.email)}
              />
              Not Shared
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

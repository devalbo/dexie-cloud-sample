import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { dexieDb } from '~/sync-engines/data/dexie-cloud/dexie-db';
import { getFriendsWithAccessToShoppingList, shareShoppingList, unshareShoppingListFromFriends } from '~/sync-engines/data/dexie-cloud/dexie-sharing';
import { MyCloudFriend } from '~/data/common-types';


interface ShoppingListAccessComponentProps {  
  shoppingListId: string;
}

export const ShoppingListAccessComponent = ({ shoppingListId }: ShoppingListAccessComponentProps) => {
  const allMyFriends = useLiveQuery(() => dexieDb.myFriends.toArray()) ?? [];
  
  const [friendsWithAccess, setFriendsWithAccess] = useState<MyCloudFriend[]>([]);

  const shoppingList = useLiveQuery(() => dexieDb.shoppingLists.get({id: shoppingListId}));

  useEffect(() => {
    getFriendsWithAccessToShoppingList(shoppingListId)
      .then((friends) => {
        console.log(friends);
        setFriendsWithAccess(friends);
      });
  }, [shoppingListId]);
  

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
                checked={friendsWithAccess.includes(friend)}
                onChange={() => doShare(friend.email)}
              />
              Shared
            </label>
            <label>
              <input
                type="radio"
                checked={!friendsWithAccess.includes(friend)}
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
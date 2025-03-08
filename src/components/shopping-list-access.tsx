import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useState } from 'react';
import { db } from '~/data/dexie-db';
import { getFriendsWithAccessToShoppingList, shareShoppingList, unshareShoppingListFromFriends } from '~/data/dexie-sharing';
import { MyDexieCloudFriend } from '~/data/types';


interface ShoppingListAccessComponentProps {  
  shoppingListId: string;
}

export const ShoppingListAccessComponent = ({ shoppingListId }: ShoppingListAccessComponentProps) => {
  const allMyFriends = useLiveQuery(() => db.myFriends.toArray()) ?? [];
  
  const [friendsWithAccess, setFriendsWithAccess] = useState<MyDexieCloudFriend[]>([]);

  const shoppingList = useLiveQuery(() => db.shoppingLists.get({id: shoppingListId}));

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
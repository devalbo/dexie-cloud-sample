import { useState, useRef } from "react";
import { dexieDb } from "../sync-engines/data/dexie-cloud/dexie-db";
import { UserLogin } from "dexie-cloud-addon";
import { useLiveQuery } from "dexie-react-hooks";
import { MyCloudFriend } from "~/data/common-types";


// Function to add a friend
const addFriend = async () => {
  const email = prompt("Enter friend's email:");
  if (email) {
    const newFriend: MyCloudFriend = { email}
    await dexieDb.myFriends.put(newFriend)
    console.log(`Friend added: ${email}`);
  }
};

const handleEmailLogin = async () => {
  await dexieDb.cloud.login();
}

const handleLogout = async () => {
  await dexieDb.cloud.logout();
}


interface MyDexieCloudUserProps {
  myDexieCloudUser: UserLogin | null
  toggleHelp: () => void
}

export const MyDexieCloudUser = ({
  myDexieCloudUser,
  toggleHelp
 }: MyDexieCloudUserProps) => {

  if (!myDexieCloudUser) {
    return (
      <div>
        <button onClick={handleEmailLogin}>
          Login to Dexie Cloud
        </button>
        <button onClick={toggleHelp}>?</button>
      </div>
    );
  }
  return (
    <div>
      My Dexie Cloud Email: {myDexieCloudUser.email}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};


interface MyDexieCloudZoneProps {
  myDexieCloudUser: UserLogin | null
  // setMyDexieCloudUser: (user: UserLogin | null) => void
}

export const MyDexieCloudZone = ({ myDexieCloudUser }: MyDexieCloudZoneProps) => {

  const myFriends = useLiveQuery(() => {
    return dexieDb.myFriends.toArray();
  });

  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      console.log(`Copied to clipboard: ${email}`);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
    setShowHelp(false);
  };

  const helpRef = useRef<HTMLDivElement | null>(null);

  
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <MyDexieCloudUser 
        myDexieCloudUser={myDexieCloudUser}
        toggleHelp={toggleHelp}
      />

      { myDexieCloudUser !== null &&
        <>
          <h6>My Dexie Cloud Friends</h6>
          
          {myFriends?.map((friend) => (
            <div key={friend.id}>
              {friend.email}
            </div>
          ))}

          <div style={{display: "flex", flexDirection: "row", gap: 10}}>
            <button onClick={addFriend}>Add Friend</button>
            <button onClick={() => setShowHelp(true)}>?</button>
          </div>


          <button onClick={() => {
            if (confirm("Are you sure you want to clear your friends?")) {
              dexieDb.myFriends.clear();
            }
          }}>Clear Friends</button>

        </>
      }

      {
        showHelp && (
          <div ref={helpRef} style={{ position: 'absolute', background: 'lightgray', padding: '10px', borderRadius: '5px' }}>
            <p>User your own email or one of these demo users:</p>
            <ul>
              <li>
                A: alice@demo.local 
                <button onClick={() => copyToClipboard("alice@demo.local")}>Copy to Clipboard</button>
              </li>
              <li>
                B: bob@demo.local 
                <button onClick={() => copyToClipboard("bob@demo.local")}>Copy to Clipboard</button>
              </li>
              <li>
                C: charlie@demo.local 
                <button onClick={() => copyToClipboard("charlie@demo.local")}>Copy to Clipboard</button>
              </li>
            </ul>
          </div>
        )
      }
    </div>
  )
}

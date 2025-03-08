import { useState, useRef } from "react";
import { db } from "../data/dexie-db";
import { UserLogin } from "dexie-cloud-addon";
import { useLiveQuery } from "dexie-react-hooks";
import { MyDexieCloudFriend } from "~/data/types";


// Function to add a friend
const addFriend = async () => {
  const email = prompt("Enter friend's email:");
  if (email) {
    const newFriend: MyDexieCloudFriend= { email}
    await db.myFriends.put(newFriend)
    console.log(`Friend added: ${email}`);
  }
};

const handleEmailLogin = async () => {
  await db.cloud.login();
}

const handleLogout = async () => {
  await db.cloud.logout();
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
    return db.myFriends.toArray();
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

  // const handleClickOutside = (event: MouseEvent) => {
  //   if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
  //     setShowHelp(false);
  //   }
  // };

  // useEffect(() => {
  //   const userSubscription = db.cloud.currentUser.subscribe(async (user) => {
  //     if (user.isLoggedIn) {
  
  //       if (!user.email) {
  //         console.error("User name or user id is not set");
  //         return;
  //       }
  
  //       setMyDexieCloudUser(user);
  
  //     } else {
  //       setMyDexieCloudUser(null);
  //     }
  //   });

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     userSubscription.unsubscribe();
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);


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
              db.myFriends.clear();
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

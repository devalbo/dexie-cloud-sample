import React, { createContext, useContext, useEffect, useState } from "react";
import { UserLogin } from "dexie-cloud-addon";
import { dexieDb } from "../../data/dexie-cloud/dexie-db";
import { AppSyncEngineContextType } from "~/data/common-types";
import { AppUserSyncContextProvider } from "~/app/app-user-sync-context";


// Create a context for the user
export const DexieCloudAppContext = createContext<AppSyncEngineContextType<UserLogin> | null>(null);


export const DexieCloudAppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [myDexieCloudUser, setMyDexieCloudUser] = useState<UserLogin | null>(null);

  useEffect(() => {
    const subscription = dexieDb.cloud.currentUser.subscribe((user) => {
      if (user.isLoggedIn) {
        console.log("User is logged in", user);
        setMyDexieCloudUser(user);
      } else {
        console.log("User is not logged in");
        setMyDexieCloudUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [myDexieCloudUser]);

  // if (!myDexieCloudUser) {
  //   return (
  //     <div>
  //       <h1>Loading Dexie Cloud User...</h1>
  //     </div>
  //   );
  // }
  
  // const cloudUser: CloudUser = {
  //   id: myDexieCloudUser.userId,
  //   email: myDexieCloudUser.email,
  //   isLoggedIn: myDexieCloudUser.isLoggedIn ?? false,
  // };

  const cloudUser = myDexieCloudUser ? 
    {
      id: myDexieCloudUser.userId,
      email: myDexieCloudUser.email,
      isLoggedIn: myDexieCloudUser?.isLoggedIn ?? false,
    } 
    : null;

  
  return (
    <DexieCloudAppContext.Provider value={{ 
      cloudUser,

      syncEngine: 'dexie-cloud',
      
      syncEngineCloudUser: myDexieCloudUser,
      setSyncEngineCloudUser: setMyDexieCloudUser
    }}>
      <AppUserSyncContextProvider
        value={{
          activeCloudSyncEngine: 'dexie-cloud',
          cloudUser: cloudUser,
        }}
      >
        {children}
      </AppUserSyncContextProvider>
    </DexieCloudAppContext.Provider>
  )
}

export const useDexieCloudAppContext = () => {
  return useContext(DexieCloudAppContext);
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserLogin } from "dexie-cloud-addon";
import { dexieDb } from "../../data/dexie-cloud/dexie-db";
import { AppSyncEngineContextType, CloudNotification } from "~/data/common-types";
import { AppUserSyncContextProvider } from "~/app/app-user-sync-context";
import { useObservable } from "dexie-react-hooks";


// Create a context for the user
export const DexieCloudAppContext = createContext<AppSyncEngineContextType<UserLogin> | null>(null);


export const DexieCloudAppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [myDexieCloudUser, setMyDexieCloudUser] = useState<UserLogin | null>(null);

  const allInvites = useObservable(dexieDb.cloud.invites)
  
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


  const getNotifications = (): CloudNotification[] => {
    if (!allInvites) {
      return [];
    }

    const notifications = allInvites
      .filter((i) => !i.accepted && !i.rejected)
      .map((i) => ({
        id: i.id,
        message: `An invitation from ${i.invitedBy?.name}`,
        from: i.invitedBy?.email ?? '',
        to: i.email ?? '',
        createdAt: i.invitedDate ?? new Date(),
      }));

    return notifications;
  }

  const notifications = getNotifications();


  const cloudUser = myDexieCloudUser ? 
    {
      id: myDexieCloudUser.userId,
      email: myDexieCloudUser.email,
      isLoggedIn: myDexieCloudUser?.isLoggedIn ?? false,
      notifications,
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

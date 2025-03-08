import React, { createContext, useEffect, useState } from "react";
import { AppContextType } from "../data/types";
import { db } from "../data/dexie-db";
import { UserLogin } from "dexie-cloud-addon";


// Create a context for the user
export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [myDexieCloudUser, setMyDexieCloudUser] = useState<UserLogin | null>(null);

  useEffect(() => {
    const subscription = db.cloud.currentUser.subscribe((user) => {
      if (user.isLoggedIn) {
        setMyDexieCloudUser(user);
      } else {
        setMyDexieCloudUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    }
  }, [myDexieCloudUser]);
  
  
  return (
    <AppContext.Provider value={{ myDexieCloudUser, setMyDexieCloudUser }}>
      {children}
    </AppContext.Provider>
  )
}


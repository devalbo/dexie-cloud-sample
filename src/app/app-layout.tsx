import { useContext } from 'react';
import { UserLogin } from "dexie-cloud-addon";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from './app-context';
import { AppContainer } from './app-container';
import { AppHeader } from './app-header';


export const AppLayout = () => {
  const [myDexieCloudUser, setMyDexieCloudUser] = useState<UserLogin | null>(null);

  return (
    <AppContext.Provider value={{ myDexieCloudUser, setMyDexieCloudUser }}>
      
      <AppHeader
        myDexieCloudUser={myDexieCloudUser}
      />

      <AppContainer>
        <Outlet />
      </AppContainer>
    
    </AppContext.Provider>
  );
}

// Create a custom hook to use the UserContext
export const useAppContext = () => {
  return useContext(AppContext);
}
import { Outlet } from "react-router-dom";
import { AppContainer } from './app-container';
import { AppHeader } from './app-header';
import { useAppUserSyncContext } from "./app-user-sync-context";


export const AppLayout = () => {
  // const activeCloudSyncEngine = useAppSyncEngineContext();
  
  // if (activeCloudSyncEngine === null) {
  //   return <div>Loading sync engine...</div>;
  // }

  // if (activeCloudSyncEngine === 'dexie-cloud') {
  //   // const dexieCloudAppContextProvider = useContext(DexieCloudAppContext);
  //   // const dexieCloudAppContextData = React.createContext<AppSyncEngineContextType<UserLogin> | null>(null);

  //   // console.log("AppLayout: dexieCloudAppContextData", dexieCloudAppContextData);

  //   // const dexieCloudAppContext = useContext(dexieCloudAppContextData);

  //   // if (!dexieCloudAppContextProvider) {
  //   //   return <div>Loading Dexie Cloud Provider...</div>;
  //   // }

  //   // if (!dexieCloudAppContext) {
  //   //   return <div>Loading Dexie Cloud Provider...</div>;
  //   // }

  //   const [syncEngineCloudUser, setSyncEngineCloudUser] = useState<UserLogin | null>(null);

  //   const { cloudUser, syncEngineCloudUser, setSyncEngineCloudUser } = dexieCloudAppContext;

  //   return (
  //     <DexieCloudAppContext.Provider value={{ 
  //       syncEngine: 'dexie-cloud',
  //       cloudUser,
  //       syncEngineCloudUser,
  //       setSyncEngineCloudUser,
  //     }}>
  //       <AppSyncUserContext.Provider value={{
  //         activeCloudSyncEngine,
  //         cloudUser,
  //       }}>
  //         <AppHeader cloudUser={syncEngineCloudUser} />
  //         <AppContainer>
  //           <Outlet />
  //         </AppContainer>
  //       </AppSyncUserContext.Provider>
  //     </DexieCloudAppContext.Provider>
  //   );
  // }

  const appSyncUserContext = useAppUserSyncContext();

  if (!appSyncUserContext) {
    return <div>Loading app sync user context...</div>;
  }

  const { cloudUser } = appSyncUserContext;

  console.log("AppLayout: appSyncUserContext", appSyncUserContext);

  // if (!cloudUser) {
  //   return <div>Loading cloud sync user...</div>;
  // }

  return (
    <>
      <AppHeader cloudUser={cloudUser} />
      <AppContainer>
        <Outlet />
      </AppContainer>
    </>
  )

  // console.error("AppLayout: cloudSyncEngine is not set");
  // return null; // Handle other cases if necessary
}

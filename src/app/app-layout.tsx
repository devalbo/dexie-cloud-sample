import { Outlet } from "react-router-dom";
import { AppContainer } from './app-container';
import { AppHeader } from './app-header';
import { useAppUserSyncContext } from "./app-user-sync-context";


export const AppLayout = () => {
  
  const appSyncUserContext = useAppUserSyncContext();

  if (!appSyncUserContext) {
    return <div>Loading app sync user context...</div>;
  }

  const { cloudUser } = appSyncUserContext;

  console.log("AppLayout: appSyncUserContext", appSyncUserContext);


  return (
    <>
      <AppHeader cloudUser={cloudUser} />
      <AppContainer>
        <Outlet />
      </AppContainer>
    </>
  )
}

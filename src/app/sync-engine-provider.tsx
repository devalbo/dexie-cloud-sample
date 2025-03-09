import React, { useContext, useState } from "react";
import { CloudSyncEngine } from "~/data/common-types";
import { DexieCloudAppContextProvider } from "~/sync-engines/components/dexie-cloud/dexie-cloud-app-context";
import { AppUserSyncContextProvider } from "./app-user-sync-context";

// Create a context for the app
const AppSyncEngineContext = React.createContext<CloudSyncEngine | null>(null);



export const SyncEngineProvider = ({ children }: { children: React.ReactNode }) => {

  const [activeCloudSyncEngine] = useState<CloudSyncEngine | null>("dexie-cloud");

  if (activeCloudSyncEngine === null) {
    return (
      <AppSyncEngineContext.Provider value={activeCloudSyncEngine}>
        <AppUserSyncContextProvider
          value={{
            activeCloudSyncEngine: activeCloudSyncEngine,
            cloudUser: null,
          }}
        >
          {children}
        </AppUserSyncContextProvider>
      </AppSyncEngineContext.Provider>
    );
  }

  if (activeCloudSyncEngine === "dexie-cloud") {
    return (
      <AppSyncEngineContext.Provider value={activeCloudSyncEngine}>
        <DexieCloudAppContextProvider>
          {children}
        </DexieCloudAppContextProvider>
      </AppSyncEngineContext.Provider>
    );
  }

  throw new Error(`Unknown sync engine: ${activeCloudSyncEngine}`);

  // return (
  //   <AppSyncEngineContext.Provider value={activeCloudSyncEngine}>
  //     {children}
  //   </AppSyncEngineContext.Provider>
  // );
};

export const useAppSyncEngineContext = () => {
  return useContext(AppSyncEngineContext);
}

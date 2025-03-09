import { MyDexieCloudZone } from "~/components/cloud-zone"
import { useDexieCloudAppContext } from "~/sync-engines/components/dexie-cloud/dexie-cloud-app-context";


export const CloudZonePage = () => {
  const appContext = useDexieCloudAppContext(); // Get the context
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  
  const { syncEngineCloudUser } = appContext; // Destructure safely

  return (
    <MyDexieCloudZone 
      myDexieCloudUser={syncEngineCloudUser}
    />
  )
}
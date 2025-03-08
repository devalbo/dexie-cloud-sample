import { useAppContext } from "~/app/app-layout";
import { MyDexieCloudZone } from "~/components/cloud-zone"


export const CloudZonePage = () => {
  const appContext = useAppContext(); // Get the context
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  
  const { myDexieCloudUser, setMyDexieCloudUser } = appContext; // Destructure safely

  return (
    <MyDexieCloudZone 
      myDexieCloudUser={myDexieCloudUser}
      setMyDexieCloudUser={setMyDexieCloudUser}
    />
  )
}
import { DEXIE_CLOUD_DATABASE_URL } from "~/sync-engines/data/dexie-cloud/dexie-config";
import { useDexieCloudAppContext } from "~/sync-engines/components/dexie-cloud/dexie-cloud-app-context";


export const DexieStatusPage = () => {

  const appContext = useDexieCloudAppContext(); // Get the context
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  
  const { syncEngineCloudUser } = appContext; // Destructure safely
  const myDexieCloudUser = syncEngineCloudUser;

  // const allInvites = useObservable(dexieDb.cloud.invites)

  // console.log("DexieStatusPage: allInvites", allInvites);
  // const invites = allInvites?.filter((i) => !i.accepted && !i.rejected)

  
  return (
    <>
      <>
        <title>Dexie Status</title>
      </>
      <>
        <h3>Dexie Status</h3>
        <div>
          {myDexieCloudUser?.isLoggedIn ? "Logged In to Sync" : "Not Logged In to Sync"}
        </div>
        <div>
          Sync Email: {myDexieCloudUser?.email}
        </div>
        <div>
          Sync User ID: {myDexieCloudUser?.userId}
        </div>
        {/* <div>
          Invites from:
          {invites?.map((i) => <DexieInvitation invitation={i} />)}
        </div> */}
        <div>
          Dexie Cloud URL: {DEXIE_CLOUD_DATABASE_URL}
        </div>
      </>
    </>
  );
};

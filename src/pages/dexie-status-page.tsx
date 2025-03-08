import { useObservable } from "dexie-react-hooks";
import { db } from "~/data/dexie-db";
import { DEXIE_CLOUD_DATABASE_URL } from "~/data/dexie-config";
import { DexieInvitation } from "~/components/dexie-invitation";
import { useAppContext } from "~/app/app-layout";


export const DexieStatusPage = () => {

  const appContext = useAppContext(); // Get the context
  if (!appContext) {
    throw new Error("useAppContext must be used within an AppContext.Provider");
  }
  
  const { myDexieCloudUser } = appContext; // Destructure safely

  const allInvites = useObservable(db.cloud.invites)

  console.log("DexieStatusPage: allInvites", allInvites);
  const invites = allInvites?.filter((i) => !i.accepted && !i.rejected)

  
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
        <div>
          Invites from:
          {invites?.map((i) => <DexieInvitation invitation={i} />)}
        </div>
        <div>
          Dexie Cloud URL: {DEXIE_CLOUD_DATABASE_URL}
        </div>
      </>
    </>
  );
};

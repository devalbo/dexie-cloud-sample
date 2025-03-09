import { DexieInvitation } from "~/components/dexie-invitation";
import { useObservable } from "dexie-react-hooks";
import { dexieDb } from "~/sync-engines/data/dexie-cloud/dexie-db";


export const NotificationsPage = () => {

  const allInvites = useObservable(dexieDb.cloud.invites)

  console.log("DexieStatusPage: allInvites", allInvites);
  const invites = allInvites?.filter((i) => !i.accepted && !i.rejected)


  // <>
  //     <h1>Cloud Shopping List Demo</h1>

  //     <ShoppingListManager 
  //       cloudUser={syncEngineCloudUser}
  //       activeShoppingListId={activeShoppingListId} 
  //       setActiveShoppingListId={setActiveShoppingListId} 
  //     />
  //   </>

  return (
    <>
      <h1>Notifications</h1>
      { invites && invites.length > 0 ? (
          <div>
            Invites from:
            {invites?.map((i) => <DexieInvitation invitation={i} />)}
          </div>
        ) : (
          <div>
            No invites
          </div>
        )
      }
    </>
  );
};
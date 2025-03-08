import { Link } from "react-router-dom";
import { UserLogin } from "dexie-cloud-addon";


export const AppHeader = ({ myDexieCloudUser }: { myDexieCloudUser: UserLogin | null }) => {


  const DexieStatusComponent = () => {
    if (!myDexieCloudUser) {
      return (
        <div>
          <Link to="/dexie-status">Dexie Login Required</Link>
        </div>
      );
    }

    const dexieStatusTitle = `Dexie Status - ${myDexieCloudUser.email}`;

    return (
      <div>
        <Link to="/dexie-status">{dexieStatusTitle}</Link>
      </div>
    );
  }


  return (
    <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        marginBottom: '1rem',
        width: '80vw',
      }}>
        <Link to="/">Home</Link>
        <Link to="/cloud-zone">Cloud Zone</Link>
        <div style={{ marginLeft: 'auto' }}>
          <DexieStatusComponent />
        </div>
      </div>
  );
}
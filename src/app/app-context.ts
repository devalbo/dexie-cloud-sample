import { createContext } from 'react';
import { UserLogin } from "dexie-cloud-addon";

export type AppContextType = {
  myDexieCloudUser: UserLogin | null;
  setMyDexieCloudUser: (user: UserLogin | null) => void;
};

export const AppContext = createContext<AppContextType | null>(null); 
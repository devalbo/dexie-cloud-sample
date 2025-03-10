import React, { useContext } from "react";
import { AppUserSyncContextType } from "~/data/common-types";


// Create the context
export const AppUserSyncContext = React.createContext<AppUserSyncContextType | null>(null);


interface AppUserSyncContextProviderProps {
  children: React.ReactNode;
  value: AppUserSyncContextType;
}

export const AppUserSyncContextProvider = ({ children, value }: AppUserSyncContextProviderProps) => {

  return (
    <AppUserSyncContext.Provider value={value}>
      {children}
    </AppUserSyncContext.Provider>
  )
}


// Custom hook to use the AppSyncUserContext
export const useAppUserSyncContext = () => {
  const context = useContext(AppUserSyncContext);
  if (!context) {
    throw new Error("useAppSyncUserContext must be used within an AppSyncUserContextProvider");
  }
  return context;
};

import React, { FunctionComponent, useState } from "react";

import { RootStore } from "./root";
import { useKeplr } from "../providers/wc-keplr";
import { AccountInitManagement } from "./account-init-management";

const StoreContext = React.createContext<RootStore | null>(null);

export const StoreProvider: FunctionComponent = ({ children }) => {
  const keplr = useKeplr();

  const [rootStore] = useState(() => new RootStore(keplr.getKeplr));

  return (
    <StoreContext.Provider value={rootStore}>
      <AccountInitManagement />
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error("You have forgot to use StoreProvider");
  }
  return store;
};

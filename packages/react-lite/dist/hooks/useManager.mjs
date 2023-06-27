// src/hooks/useManager.ts
import React2 from "react";

// src/provider.tsx
import {
  Logger,
  State,
  WalletManager
} from "@cosmos-kit/core";
import {
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var walletContext = createContext(null);

// src/hooks/useManager.ts
var useManager = () => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const {
    walletManager: {
      mainWallets,
      chainRecords,
      walletRepos,
      defaultNameService,
      getChainRecord,
      getWalletRepo,
      addChains,
      getChainLogo,
      getNameService,
      on,
      off
    }
  } = context;
  return {
    chainRecords,
    walletRepos,
    mainWallets,
    defaultNameService,
    getChainRecord,
    getWalletRepo,
    addChains,
    getChainLogo,
    getNameService,
    on,
    off
  };
};
export {
  useManager
};
//# sourceMappingURL=useManager.mjs.map
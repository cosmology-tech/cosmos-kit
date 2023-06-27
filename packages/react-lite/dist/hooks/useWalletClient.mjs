// src/hooks/useWalletClient.ts
import { State as State2 } from "@cosmos-kit/core";
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

// src/hooks/useWalletClient.ts
var useWalletClient = (walletName) => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w) => w.isActive);
  if (!mainWallet) {
    return {
      client: void 0,
      status: State2.Init,
      message: void 0
    };
  }
  const { clientMutable } = mainWallet;
  return {
    client: clientMutable.data,
    status: clientMutable.state,
    message: clientMutable.message
  };
};
export {
  useWalletClient
};
//# sourceMappingURL=useWalletClient.mjs.map
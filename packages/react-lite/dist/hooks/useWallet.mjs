// src/hooks/useWallet.ts
import { WalletStatus } from "@cosmos-kit/core";
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

// src/hooks/useWallet.ts
var useWallet = (walletName, activeOnly = true) => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w) => w.isActive);
  if (!mainWallet) {
    return {
      mainWallet,
      chainWallets: [],
      wallet: void 0,
      status: WalletStatus.Disconnected,
      message: void 0
    };
  }
  const {
    walletInfo,
    getChainWalletList,
    getGlobalStatusAndMessage
  } = mainWallet;
  const [globalStatus, globalMessage] = getGlobalStatusAndMessage(activeOnly);
  return {
    mainWallet,
    chainWallets: getChainWalletList(activeOnly),
    wallet: walletInfo,
    status: globalStatus,
    message: globalMessage
  };
};
export {
  useWallet
};
//# sourceMappingURL=useWallet.mjs.map
// src/hooks/useChain.ts
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

// src/utils.ts
import {
  WalletStatus
} from "@cosmos-kit/core";
function getChainWalletContext(chainId, wallet, sync = true) {
  function walletAssert(func, params = [], name) {
    if (!wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }
    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${wallet?.walletInfo.prettyName} yet.`
      );
    }
    return func(...params);
  }
  function clientMethodAssert(func, params = [], name) {
    if (!wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }
    if (!wallet?.client) {
      throw new Error(`Wallet Client is undefined.`);
    }
    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${wallet?.walletInfo.prettyName} Client yet.`
      );
    }
    return func(...params);
  }
  const status = wallet?.walletStatus || WalletStatus.Disconnected;
  return {
    chainWallet: wallet,
    chain: wallet?.chainRecord.chain,
    assets: wallet?.chainRecord.assetList,
    logoUrl: wallet?.chainLogoUrl,
    wallet: wallet?.walletInfo,
    address: wallet?.address,
    username: wallet?.username,
    message: wallet ? wallet.message : "No wallet is connected walletly.",
    status,
    isWalletDisconnected: status === "Disconnected",
    isWalletConnecting: status === "Connecting",
    isWalletConnected: status === "Connected",
    isWalletRejected: status === "Rejected",
    isWalletNotExist: status === "NotExist",
    isWalletError: status === "Error",
    connect: () => walletAssert(wallet?.connect, [void 0, sync], "connect"),
    disconnect: () => walletAssert(wallet?.disconnect, [void 0, sync], "disconnect"),
    getRpcEndpoint: (isLazy) => walletAssert(wallet?.getRpcEndpoint, [isLazy], "getRpcEndpoint"),
    getRestEndpoint: (isLazy) => walletAssert(wallet?.getRestEndpoint, [isLazy], "getRestEndpoint"),
    getStargateClient: () => walletAssert(wallet?.getStargateClient, [], "getStargateClient"),
    getCosmWasmClient: () => walletAssert(wallet?.getCosmWasmClient, [], "getCosmWasmClient"),
    getSigningStargateClient: () => walletAssert(
      wallet?.getSigningStargateClient,
      [],
      "getSigningStargateClient"
    ),
    getSigningCosmWasmClient: () => walletAssert(
      wallet?.getSigningCosmWasmClient,
      [],
      "getSigningCosmWasmClient"
    ),
    getNameService: () => walletAssert(wallet?.getNameService, [], "getNameService"),
    estimateFee: (...params) => walletAssert(wallet?.estimateFee, params, "estimateFee"),
    sign: (...params) => walletAssert(wallet?.sign, params, "sign"),
    broadcast: (...params) => walletAssert(wallet?.broadcast, params, "broadcast"),
    signAndBroadcast: (...params) => walletAssert(wallet?.signAndBroadcast, params, "signAndBroadcast"),
    qrUrl: wallet?.client?.qrUrl,
    appUrl: wallet?.client?.appUrl,
    enable: () => clientMethodAssert(
      wallet?.client?.enable.bind(wallet.client),
      [chainId],
      "enable"
    ),
    suggestToken: (...params) => clientMethodAssert(
      wallet?.client?.suggestToken.bind(wallet.client),
      [...params],
      "suggestToken"
    ),
    getAccount: () => clientMethodAssert(
      wallet?.client?.getAccount.bind(wallet.client),
      [chainId],
      "getAccount"
    ),
    getOfflineSigner: () => clientMethodAssert(
      wallet?.client?.getOfflineSigner.bind(wallet.client),
      [chainId, wallet?.preferredSignType],
      "getOfflineSigner"
    ),
    getOfflineSignerAmino: () => clientMethodAssert(
      wallet?.client?.getOfflineSignerAmino.bind(wallet.client),
      [chainId],
      "getOfflineSignerAmino"
    ),
    getOfflineSignerDirect: () => clientMethodAssert(
      wallet?.client?.getOfflineSignerDirect.bind(wallet.client),
      [chainId],
      "getOfflineSignerDirect"
    ),
    signAmino: (...params) => clientMethodAssert(
      wallet?.client?.signAmino.bind(wallet.client),
      [chainId, ...params],
      "signAmino"
    ),
    signDirect: (...params) => clientMethodAssert(
      wallet?.client?.signDirect.bind(wallet.client),
      [chainId, ...params],
      "signDirect"
    ),
    signArbitrary: (...params) => clientMethodAssert(
      wallet?.client?.signArbitrary.bind(wallet.client),
      [chainId, ...params],
      "signArbitrary"
    ),
    sendTx: (...params) => clientMethodAssert(
      wallet?.client?.sendTx.bind(wallet.client),
      [chainId, ...params],
      "sendTx"
    )
  };
}

// src/hooks/useChain.ts
var useChain = (chainName, sync = true) => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager, modalProvided } = context;
  if (!modalProvided) {
    throw new Error(
      "You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead."
    );
  }
  const walletRepo = walletManager.getWalletRepo(chainName);
  walletRepo.activate();
  const {
    connect,
    disconnect,
    openView,
    closeView,
    current,
    chainRecord: { chain, assetList },
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService
  } = walletRepo;
  const chainWalletContext = getChainWalletContext(
    chain.chain_id,
    current,
    sync
  );
  return {
    ...chainWalletContext,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(void 0, sync),
    disconnect: () => disconnect(void 0, sync),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService
  };
};

// src/hooks/useChainWallet.ts
import React3 from "react";
var useChainWallet = (chainName, walletName, sync = true) => {
  const context = React3.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();
  return getChainWalletContext(wallet.chain.chain_id, wallet, sync);
};

// src/hooks/useManager.ts
import React4 from "react";
var useManager = () => {
  const context = React4.useContext(walletContext);
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

// src/hooks/useNameService.ts
import {
  getNameServiceRegistryFromName,
  State as State2
} from "@cosmos-kit/core";
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";
var useNameService = (name) => {
  const [state, setState] = useState2(State2.Pending);
  const [ns, setNS] = useState2();
  const [msg, setMsg] = useState2();
  const { defaultNameService, getNameService } = useManager();
  const registry = useMemo2(
    () => getNameServiceRegistryFromName(name || defaultNameService),
    [name]
  );
  if (!registry) {
    throw new Error("No such name service: " + (name || defaultNameService));
  }
  useEffect2(() => {
    getNameService().then((ns2) => {
      setNS(ns2);
      setState(State2.Done);
    }).catch((e) => {
      setMsg(e.message);
      setState(State2.Error);
    }).finally(() => {
      if (state === "Pending") {
        setState(State2.Init);
      }
    });
  }, [name]);
  return {
    state,
    data: ns,
    message: msg
  };
};

// src/hooks/useWallet.ts
import { WalletStatus as WalletStatus2 } from "@cosmos-kit/core";
import React6 from "react";
var useWallet = (walletName, activeOnly = true) => {
  const context = React6.useContext(walletContext);
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
      status: WalletStatus2.Disconnected,
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

// src/hooks/useWalletClient.ts
import { State as State3 } from "@cosmos-kit/core";
import React7 from "react";
var useWalletClient = (walletName) => {
  const context = React7.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w) => w.isActive);
  if (!mainWallet) {
    return {
      client: void 0,
      status: State3.Init,
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
  useChain,
  useChainWallet,
  useManager,
  useNameService,
  useWallet,
  useWalletClient
};
//# sourceMappingURL=index.mjs.map
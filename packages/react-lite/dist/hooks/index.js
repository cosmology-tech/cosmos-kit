var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/hooks/index.ts
var hooks_exports = {};
__export(hooks_exports, {
  useChain: () => useChain,
  useChainWallet: () => useChainWallet,
  useManager: () => useManager,
  useNameService: () => useNameService,
  useWallet: () => useWallet,
  useWalletClient: () => useWalletClient
});
module.exports = __toCommonJS(hooks_exports);

// src/hooks/useChain.ts
var import_react2 = __toESM(require("react"));

// src/provider.tsx
var import_core = require("@cosmos-kit/core");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var walletContext = (0, import_react.createContext)(null);

// src/utils.ts
var import_core2 = require("@cosmos-kit/core");
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
  const status = wallet?.walletStatus || import_core2.WalletStatus.Disconnected;
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
  const context = import_react2.default.useContext(walletContext);
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
var import_react3 = __toESM(require("react"));
var useChainWallet = (chainName, walletName, sync = true) => {
  const context = import_react3.default.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();
  return getChainWalletContext(wallet.chain.chain_id, wallet, sync);
};

// src/hooks/useManager.ts
var import_react4 = __toESM(require("react"));
var useManager = () => {
  const context = import_react4.default.useContext(walletContext);
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
var import_core3 = require("@cosmos-kit/core");
var import_react5 = require("react");
var useNameService = (name) => {
  const [state, setState] = (0, import_react5.useState)(import_core3.State.Pending);
  const [ns, setNS] = (0, import_react5.useState)();
  const [msg, setMsg] = (0, import_react5.useState)();
  const { defaultNameService, getNameService } = useManager();
  const registry = (0, import_react5.useMemo)(
    () => (0, import_core3.getNameServiceRegistryFromName)(name || defaultNameService),
    [name]
  );
  if (!registry) {
    throw new Error("No such name service: " + (name || defaultNameService));
  }
  (0, import_react5.useEffect)(() => {
    getNameService().then((ns2) => {
      setNS(ns2);
      setState(import_core3.State.Done);
    }).catch((e) => {
      setMsg(e.message);
      setState(import_core3.State.Error);
    }).finally(() => {
      if (state === "Pending") {
        setState(import_core3.State.Init);
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
var import_core4 = require("@cosmos-kit/core");
var import_react6 = __toESM(require("react"));
var useWallet = (walletName, activeOnly = true) => {
  const context = import_react6.default.useContext(walletContext);
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
      status: import_core4.WalletStatus.Disconnected,
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
var import_core5 = require("@cosmos-kit/core");
var import_react7 = __toESM(require("react"));
var useWalletClient = (walletName) => {
  const context = import_react7.default.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }
  const { walletManager } = context;
  const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w) => w.isActive);
  if (!mainWallet) {
    return {
      client: void 0,
      status: import_core5.State.Init,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useChain,
  useChainWallet,
  useManager,
  useNameService,
  useWallet,
  useWalletClient
});
//# sourceMappingURL=index.js.map
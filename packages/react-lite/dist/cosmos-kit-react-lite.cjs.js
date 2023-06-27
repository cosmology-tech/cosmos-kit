var $YkmjJ$react = require("react");
var $YkmjJ$reactjsxruntime = require("react/jsx-runtime");
var $YkmjJ$cosmoskitcore = require("@cosmos-kit/core");

function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $f8f81db8968d7a0a$exports = {};
var $36dd94b45afeb14b$exports = {};

$parcel$export($36dd94b45afeb14b$exports, "useChain", () => $36dd94b45afeb14b$export$a4a17273dffcc09c);

var $c25266d3410ed5cd$exports = {};

$parcel$export($c25266d3410ed5cd$exports, "walletContext", () => $c25266d3410ed5cd$export$f8e5db10e4e4ab77);
$parcel$export($c25266d3410ed5cd$exports, "ChainProvider", () => $c25266d3410ed5cd$export$685bdd2e4d4c3a69);



const $c25266d3410ed5cd$export$f8e5db10e4e4ab77 = /*#__PURE__*/ (0, $YkmjJ$react.createContext)(null);
const $c25266d3410ed5cd$export$685bdd2e4d4c3a69 = ({ chains: chains , assetLists: assetLists , wallets: wallets , walletModal: ProvidedWalletModal , throwErrors: throwErrors = false , defaultNameService: defaultNameService = "icns" , walletConnectOptions: walletConnectOptions , signerOptions: signerOptions , endpointOptions: endpointOptions , sessionOptions: sessionOptions , logLevel: logLevel = "WARN" , children: children  })=>{
    const logger = (0, $YkmjJ$react.useMemo)(()=>new (0, $YkmjJ$cosmoskitcore.Logger)(logLevel), []);
    const walletManager = (0, $YkmjJ$react.useMemo)(()=>new (0, $YkmjJ$cosmoskitcore.WalletManager)(chains, assetLists, wallets, logger, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions), []);
    const [isViewOpen, setViewOpen] = (0, $YkmjJ$react.useState)(false);
    const [viewWalletRepo, setViewWalletRepo] = (0, $YkmjJ$react.useState)();
    const [, setData] = (0, $YkmjJ$react.useState)();
    const [, setState] = (0, $YkmjJ$react.useState)((0, $YkmjJ$cosmoskitcore.State).Init);
    const [, setMsg] = (0, $YkmjJ$react.useState)();
    walletManager.setActions({
        viewOpen: setViewOpen,
        viewWalletRepo: setViewWalletRepo,
        data: setData,
        state: setState,
        message: setMsg
    });
    walletManager.walletRepos.forEach((wr)=>{
        wr.setActions({
            viewOpen: setViewOpen,
            viewWalletRepo: setViewWalletRepo
        });
        wr.wallets.forEach((w)=>{
            w.setActions({
                data: setData,
                state: setState,
                message: setMsg
            });
        });
    });
    walletManager.mainWallets.forEach((w)=>{
        w.setActions({
            data: setData,
            state: setState,
            message: setMsg
        });
    });
    (0, $YkmjJ$react.useEffect)(()=>{
        walletManager.onMounted();
        return ()=>{
            setViewOpen(false);
            walletManager.onUnmounted();
        };
    }, []);
    return /*#__PURE__*/ (0, $YkmjJ$reactjsxruntime.jsxs)($c25266d3410ed5cd$export$f8e5db10e4e4ab77.Provider, {
        value: {
            walletManager: walletManager,
            modalProvided: Boolean(ProvidedWalletModal)
        },
        children: [
            ProvidedWalletModal && /*#__PURE__*/ (0, $YkmjJ$reactjsxruntime.jsx)(ProvidedWalletModal, {
                isOpen: isViewOpen,
                setOpen: setViewOpen,
                walletRepo: viewWalletRepo
            }),
            children
        ]
    });
};



function $683896c95988317a$export$66627a4e2937c32b(chainId, wallet, sync = true) {
    function walletAssert(func, params = [], name) {
        if (!wallet) throw new Error(`Wallet is undefined. Please choose a wallet to connect first.`);
        if (!func) throw new Error(`Function ${name} not implemented by ${wallet?.walletInfo.prettyName} yet.`);
        return func(...params);
    }
    function clientMethodAssert(func, params = [], name) {
        if (!wallet) throw new Error(`Wallet is undefined. Please choose a wallet to connect first.`);
        if (!wallet?.client) throw new Error(`Wallet Client is undefined.`);
        if (!func) throw new Error(`Function ${name} not implemented by ${wallet?.walletInfo.prettyName} Client yet.`);
        return func(...params);
    }
    const status = wallet?.walletStatus || (0, $YkmjJ$cosmoskitcore.WalletStatus).Disconnected;
    return {
        chainWallet: wallet,
        chain: wallet?.chainRecord.chain,
        assets: wallet?.chainRecord.assetList,
        logoUrl: wallet?.chainLogoUrl,
        wallet: wallet?.walletInfo,
        address: wallet?.address,
        username: wallet?.username,
        message: wallet ? wallet.message : "No wallet is connected walletly.",
        status: status,
        isWalletDisconnected: status === "Disconnected",
        isWalletConnecting: status === "Connecting",
        isWalletConnected: status === "Connected",
        isWalletRejected: status === "Rejected",
        isWalletNotExist: status === "NotExist",
        isWalletError: status === "Error",
        connect: ()=>walletAssert(wallet?.connect, [
                void 0,
                sync
            ], "connect"),
        disconnect: ()=>walletAssert(wallet?.disconnect, [
                void 0,
                sync
            ], "disconnect"),
        getRpcEndpoint: (isLazy)=>walletAssert(wallet?.getRpcEndpoint, [
                isLazy
            ], "getRpcEndpoint"),
        getRestEndpoint: (isLazy)=>walletAssert(wallet?.getRestEndpoint, [
                isLazy
            ], "getRestEndpoint"),
        getStargateClient: ()=>walletAssert(wallet?.getStargateClient, [], "getStargateClient"),
        getCosmWasmClient: ()=>walletAssert(wallet?.getCosmWasmClient, [], "getCosmWasmClient"),
        getSigningStargateClient: ()=>walletAssert(wallet?.getSigningStargateClient, [], "getSigningStargateClient"),
        getSigningCosmWasmClient: ()=>walletAssert(wallet?.getSigningCosmWasmClient, [], "getSigningCosmWasmClient"),
        getNameService: ()=>walletAssert(wallet?.getNameService, [], "getNameService"),
        estimateFee: (...params)=>walletAssert(wallet?.estimateFee, params, "estimateFee"),
        sign: (...params)=>walletAssert(wallet?.sign, params, "sign"),
        broadcast: (...params)=>walletAssert(wallet?.broadcast, params, "broadcast"),
        signAndBroadcast: (...params)=>walletAssert(wallet?.signAndBroadcast, params, "signAndBroadcast"),
        qrUrl: wallet?.client?.qrUrl,
        appUrl: wallet?.client?.appUrl,
        enable: ()=>clientMethodAssert(wallet?.client?.enable.bind(wallet.client), [
                chainId
            ], "enable"),
        suggestToken: (...params)=>clientMethodAssert(wallet?.client?.suggestToken.bind(wallet.client), [
                ...params
            ], "suggestToken"),
        getAccount: ()=>clientMethodAssert(wallet?.client?.getAccount.bind(wallet.client), [
                chainId
            ], "getAccount"),
        getOfflineSigner: ()=>clientMethodAssert(wallet?.client?.getOfflineSigner.bind(wallet.client), [
                chainId,
                wallet?.preferredSignType
            ], "getOfflineSigner"),
        getOfflineSignerAmino: ()=>clientMethodAssert(wallet?.client?.getOfflineSignerAmino.bind(wallet.client), [
                chainId
            ], "getOfflineSignerAmino"),
        getOfflineSignerDirect: ()=>clientMethodAssert(wallet?.client?.getOfflineSignerDirect.bind(wallet.client), [
                chainId
            ], "getOfflineSignerDirect"),
        signAmino: (...params)=>clientMethodAssert(wallet?.client?.signAmino.bind(wallet.client), [
                chainId,
                ...params
            ], "signAmino"),
        signDirect: (...params)=>clientMethodAssert(wallet?.client?.signDirect.bind(wallet.client), [
                chainId,
                ...params
            ], "signDirect"),
        sendTx: (...params)=>clientMethodAssert(wallet?.client?.sendTx.bind(wallet.client), [
                chainId,
                ...params
            ], "sendTx")
    };
}


const $36dd94b45afeb14b$export$a4a17273dffcc09c = (chainName, sync = true)=>{
    const context = (0, ($parcel$interopDefault($YkmjJ$react))).useContext((0, $c25266d3410ed5cd$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager , modalProvided: modalProvided  } = context;
    if (!modalProvided) throw new Error("You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead.");
    const walletRepo = walletManager.getWalletRepo(chainName);
    walletRepo.activate();
    const { connect: connect , disconnect: disconnect , openView: openView , closeView: closeView , current: current , chainRecord: { chain: chain , assetList: assetList  } , getRpcEndpoint: getRpcEndpoint , getRestEndpoint: getRestEndpoint , getStargateClient: getStargateClient , getCosmWasmClient: getCosmWasmClient , getNameService: getNameService  } = walletRepo;
    const chainWalletContext = (0, $683896c95988317a$export$66627a4e2937c32b)(chain.chain_id, current, sync);
    return {
        ...chainWalletContext,
        walletRepo: walletRepo,
        chain: chain,
        assets: assetList,
        openView: openView,
        closeView: closeView,
        connect: ()=>connect(void 0, sync),
        disconnect: ()=>disconnect(void 0, sync),
        getRpcEndpoint: getRpcEndpoint,
        getRestEndpoint: getRestEndpoint,
        getStargateClient: getStargateClient,
        getCosmWasmClient: getCosmWasmClient,
        getNameService: getNameService
    };
};


var $d0129f3c38df318c$exports = {};

$parcel$export($d0129f3c38df318c$exports, "useChainWallet", () => $d0129f3c38df318c$export$fe5dc7efc8443d0);



const $d0129f3c38df318c$export$fe5dc7efc8443d0 = (chainName, walletName, sync = true)=>{
    const context = (0, ($parcel$interopDefault($YkmjJ$react))).useContext((0, $c25266d3410ed5cd$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const wallet = walletManager.getChainWallet(chainName, walletName);
    wallet.activate();
    return (0, $683896c95988317a$export$66627a4e2937c32b)(wallet.chain.chain_id, wallet, sync);
};


var $7b005430d487103c$exports = {};

$parcel$export($7b005430d487103c$exports, "useManager", () => $7b005430d487103c$export$ddf53f26a9d1c984);


const $7b005430d487103c$export$ddf53f26a9d1c984 = ()=>{
    const context = (0, ($parcel$interopDefault($YkmjJ$react))).useContext((0, $c25266d3410ed5cd$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: { mainWallets: mainWallets , chainRecords: chainRecords , walletRepos: walletRepos , defaultNameService: defaultNameService , getChainRecord: getChainRecord , getWalletRepo: getWalletRepo , addChains: addChains , getChainLogo: getChainLogo , getNameService: getNameService , on: on , off: off  }  } = context;
    return {
        chainRecords: chainRecords,
        walletRepos: walletRepos,
        mainWallets: mainWallets,
        defaultNameService: defaultNameService,
        getChainRecord: getChainRecord,
        getWalletRepo: getWalletRepo,
        addChains: addChains,
        getChainLogo: getChainLogo,
        getNameService: getNameService,
        on: on,
        off: off
    };
};


var $086116946d6639a2$exports = {};

$parcel$export($086116946d6639a2$exports, "useNameService", () => $086116946d6639a2$export$79b48125021310c7);



const $086116946d6639a2$export$79b48125021310c7 = (name)=>{
    const [state, setState] = (0, $YkmjJ$react.useState)((0, $YkmjJ$cosmoskitcore.State).Pending);
    const [ns, setNS] = (0, $YkmjJ$react.useState)();
    const [msg, setMsg] = (0, $YkmjJ$react.useState)();
    const { defaultNameService: defaultNameService , getNameService: getNameService  } = (0, $7b005430d487103c$export$ddf53f26a9d1c984)();
    const registry = (0, $YkmjJ$react.useMemo)(()=>(0, $YkmjJ$cosmoskitcore.getNameServiceRegistryFromName)(name || defaultNameService), [
        name
    ]);
    if (!registry) throw new Error("No such name service: " + (name || defaultNameService));
    (0, $YkmjJ$react.useEffect)(()=>{
        getNameService().then((ns)=>{
            setNS(ns);
            setState((0, $YkmjJ$cosmoskitcore.State).Done);
        }).catch((e)=>{
            setMsg(e.message);
            setState((0, $YkmjJ$cosmoskitcore.State).Error);
        }).finally(()=>{
            if (state === "Pending") setState((0, $YkmjJ$cosmoskitcore.State).Init);
        });
    }, [
        name
    ]);
    return {
        state: state,
        data: ns,
        message: msg
    };
};


var $36ea51ec33c5f72d$exports = {};

$parcel$export($36ea51ec33c5f72d$exports, "useWallet", () => $36ea51ec33c5f72d$export$c34addee860b0acb);



const $36ea51ec33c5f72d$export$c34addee860b0acb = (walletName, activeOnly = true)=>{
    const context = (0, ($parcel$interopDefault($YkmjJ$react))).useContext((0, $c25266d3410ed5cd$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w)=>w.isActive);
    if (!mainWallet) return {
        mainWallet: mainWallet,
        chainWallets: [],
        wallet: void 0,
        status: (0, $YkmjJ$cosmoskitcore.WalletStatus).Disconnected,
        message: void 0
    };
    const { walletInfo: walletInfo , getChainWalletList: getChainWalletList , getGlobalStatusAndMessage: getGlobalStatusAndMessage  } = mainWallet;
    const [globalStatus, globalMessage] = getGlobalStatusAndMessage(activeOnly);
    return {
        mainWallet: mainWallet,
        chainWallets: getChainWalletList(activeOnly),
        wallet: walletInfo,
        status: globalStatus,
        message: globalMessage
    };
};


var $aa611506eb6f7b37$exports = {};

$parcel$export($aa611506eb6f7b37$exports, "useWalletClient", () => $aa611506eb6f7b37$export$742c698ad1033029);



const $aa611506eb6f7b37$export$742c698ad1033029 = (walletName)=>{
    const context = (0, ($parcel$interopDefault($YkmjJ$react))).useContext((0, $c25266d3410ed5cd$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w)=>w.isActive);
    if (!mainWallet) return {
        client: void 0,
        status: (0, $YkmjJ$cosmoskitcore.State).Init,
        message: void 0
    };
    const { clientMutable: clientMutable  } = mainWallet;
    return {
        client: clientMutable.data,
        status: clientMutable.state,
        message: clientMutable.message
    };
};


$parcel$exportWildcard($f8f81db8968d7a0a$exports, $36dd94b45afeb14b$exports);
$parcel$exportWildcard($f8f81db8968d7a0a$exports, $d0129f3c38df318c$exports);
$parcel$exportWildcard($f8f81db8968d7a0a$exports, $7b005430d487103c$exports);
$parcel$exportWildcard($f8f81db8968d7a0a$exports, $086116946d6639a2$exports);
$parcel$exportWildcard($f8f81db8968d7a0a$exports, $36ea51ec33c5f72d$exports);
$parcel$exportWildcard($f8f81db8968d7a0a$exports, $aa611506eb6f7b37$exports);



$parcel$exportWildcard(module.exports, $f8f81db8968d7a0a$exports);
$parcel$exportWildcard(module.exports, $c25266d3410ed5cd$exports);


//# sourceMappingURL=cosmos-kit-react-lite.cjs.js.map

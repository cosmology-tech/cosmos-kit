import $fpwf7$react, {createContext as $fpwf7$createContext, useMemo as $fpwf7$useMemo, useState as $fpwf7$useState, useEffect as $fpwf7$useEffect} from "react";
import {jsxs as $fpwf7$jsxs, jsx as $fpwf7$jsx} from "react/jsx-runtime";
import {Logger as $fpwf7$Logger, WalletManager as $fpwf7$WalletManager, State as $fpwf7$State, WalletStatus as $fpwf7$WalletStatus, getNameServiceRegistryFromName as $fpwf7$getNameServiceRegistryFromName} from "@cosmos-kit/core";

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
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $fbaf5b00739eae1e$exports = {};
var $3218793915077db0$exports = {};

$parcel$export($3218793915077db0$exports, "useChain", () => $3218793915077db0$export$a4a17273dffcc09c);

var $a4fafc3217ced689$exports = {};

$parcel$export($a4fafc3217ced689$exports, "walletContext", () => $a4fafc3217ced689$export$f8e5db10e4e4ab77);
$parcel$export($a4fafc3217ced689$exports, "ChainProvider", () => $a4fafc3217ced689$export$685bdd2e4d4c3a69);



const $a4fafc3217ced689$export$f8e5db10e4e4ab77 = /*#__PURE__*/ (0, $fpwf7$createContext)(null);
const $a4fafc3217ced689$export$685bdd2e4d4c3a69 = ({ chains: chains , assetLists: assetLists , wallets: wallets , walletModal: ProvidedWalletModal , throwErrors: throwErrors = false , defaultNameService: defaultNameService = "icns" , walletConnectOptions: walletConnectOptions , signerOptions: signerOptions , endpointOptions: endpointOptions , sessionOptions: sessionOptions , logLevel: logLevel = "WARN" , children: children  })=>{
    const logger = (0, $fpwf7$useMemo)(()=>new (0, $fpwf7$Logger)(logLevel), []);
    const walletManager = (0, $fpwf7$useMemo)(()=>new (0, $fpwf7$WalletManager)(chains, assetLists, wallets, logger, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions), []);
    const [isViewOpen, setViewOpen] = (0, $fpwf7$useState)(false);
    const [viewWalletRepo, setViewWalletRepo] = (0, $fpwf7$useState)();
    const [, setData] = (0, $fpwf7$useState)();
    const [, setState] = (0, $fpwf7$useState)((0, $fpwf7$State).Init);
    const [, setMsg] = (0, $fpwf7$useState)();
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
    (0, $fpwf7$useEffect)(()=>{
        walletManager.onMounted();
        return ()=>{
            setViewOpen(false);
            walletManager.onUnmounted();
        };
    }, []);
    return /*#__PURE__*/ (0, $fpwf7$jsxs)($a4fafc3217ced689$export$f8e5db10e4e4ab77.Provider, {
        value: {
            walletManager: walletManager,
            modalProvided: Boolean(ProvidedWalletModal)
        },
        children: [
            ProvidedWalletModal && /*#__PURE__*/ (0, $fpwf7$jsx)(ProvidedWalletModal, {
                isOpen: isViewOpen,
                setOpen: setViewOpen,
                walletRepo: viewWalletRepo
            }),
            children
        ]
    });
};



function $62e23c2a8913dd80$export$66627a4e2937c32b(chainId, wallet, sync = true) {
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
    const status = wallet?.walletStatus || (0, $fpwf7$WalletStatus).Disconnected;
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


const $3218793915077db0$export$a4a17273dffcc09c = (chainName, sync = true)=>{
    const context = (0, $fpwf7$react).useContext((0, $a4fafc3217ced689$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager , modalProvided: modalProvided  } = context;
    if (!modalProvided) throw new Error("You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead.");
    const walletRepo = walletManager.getWalletRepo(chainName);
    walletRepo.activate();
    const { connect: connect , disconnect: disconnect , openView: openView , closeView: closeView , current: current , chainRecord: { chain: chain , assetList: assetList  } , getRpcEndpoint: getRpcEndpoint , getRestEndpoint: getRestEndpoint , getStargateClient: getStargateClient , getCosmWasmClient: getCosmWasmClient , getNameService: getNameService  } = walletRepo;
    const chainWalletContext = (0, $62e23c2a8913dd80$export$66627a4e2937c32b)(chain.chain_id, current, sync);
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


var $1649b9ecade4d58a$exports = {};

$parcel$export($1649b9ecade4d58a$exports, "useChainWallet", () => $1649b9ecade4d58a$export$fe5dc7efc8443d0);



const $1649b9ecade4d58a$export$fe5dc7efc8443d0 = (chainName, walletName, sync = true)=>{
    const context = (0, $fpwf7$react).useContext((0, $a4fafc3217ced689$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const wallet = walletManager.getChainWallet(chainName, walletName);
    wallet.activate();
    return (0, $62e23c2a8913dd80$export$66627a4e2937c32b)(wallet.chain.chain_id, wallet, sync);
};


var $fe91e0d198dcf521$exports = {};

$parcel$export($fe91e0d198dcf521$exports, "useManager", () => $fe91e0d198dcf521$export$ddf53f26a9d1c984);


const $fe91e0d198dcf521$export$ddf53f26a9d1c984 = ()=>{
    const context = (0, $fpwf7$react).useContext((0, $a4fafc3217ced689$export$f8e5db10e4e4ab77));
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


var $336a02e188ffb57f$exports = {};

$parcel$export($336a02e188ffb57f$exports, "useNameService", () => $336a02e188ffb57f$export$79b48125021310c7);



const $336a02e188ffb57f$export$79b48125021310c7 = (name)=>{
    const [state, setState] = (0, $fpwf7$useState)((0, $fpwf7$State).Pending);
    const [ns, setNS] = (0, $fpwf7$useState)();
    const [msg, setMsg] = (0, $fpwf7$useState)();
    const { defaultNameService: defaultNameService , getNameService: getNameService  } = (0, $fe91e0d198dcf521$export$ddf53f26a9d1c984)();
    const registry = (0, $fpwf7$useMemo)(()=>(0, $fpwf7$getNameServiceRegistryFromName)(name || defaultNameService), [
        name
    ]);
    if (!registry) throw new Error("No such name service: " + (name || defaultNameService));
    (0, $fpwf7$useEffect)(()=>{
        getNameService().then((ns)=>{
            setNS(ns);
            setState((0, $fpwf7$State).Done);
        }).catch((e)=>{
            setMsg(e.message);
            setState((0, $fpwf7$State).Error);
        }).finally(()=>{
            if (state === "Pending") setState((0, $fpwf7$State).Init);
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


var $1bb370a23e69a7ee$exports = {};

$parcel$export($1bb370a23e69a7ee$exports, "useWallet", () => $1bb370a23e69a7ee$export$c34addee860b0acb);



const $1bb370a23e69a7ee$export$c34addee860b0acb = (walletName, activeOnly = true)=>{
    const context = (0, $fpwf7$react).useContext((0, $a4fafc3217ced689$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w)=>w.isActive);
    if (!mainWallet) return {
        mainWallet: mainWallet,
        chainWallets: [],
        wallet: void 0,
        status: (0, $fpwf7$WalletStatus).Disconnected,
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


var $9884b0cff108e8d0$exports = {};

$parcel$export($9884b0cff108e8d0$exports, "useWalletClient", () => $9884b0cff108e8d0$export$742c698ad1033029);



const $9884b0cff108e8d0$export$742c698ad1033029 = (walletName)=>{
    const context = (0, $fpwf7$react).useContext((0, $a4fafc3217ced689$export$f8e5db10e4e4ab77));
    if (!context) throw new Error("You have forgot to use ChainProvider.");
    const { walletManager: walletManager  } = context;
    const mainWallet = walletName ? walletManager.getMainWallet(walletName) : walletManager.mainWallets.find((w)=>w.isActive);
    if (!mainWallet) return {
        client: void 0,
        status: (0, $fpwf7$State).Init,
        message: void 0
    };
    const { clientMutable: clientMutable  } = mainWallet;
    return {
        client: clientMutable.data,
        status: clientMutable.state,
        message: clientMutable.message
    };
};


$parcel$exportWildcard($fbaf5b00739eae1e$exports, $3218793915077db0$exports);
$parcel$exportWildcard($fbaf5b00739eae1e$exports, $1649b9ecade4d58a$exports);
$parcel$exportWildcard($fbaf5b00739eae1e$exports, $fe91e0d198dcf521$exports);
$parcel$exportWildcard($fbaf5b00739eae1e$exports, $336a02e188ffb57f$exports);
$parcel$exportWildcard($fbaf5b00739eae1e$exports, $1bb370a23e69a7ee$exports);
$parcel$exportWildcard($fbaf5b00739eae1e$exports, $9884b0cff108e8d0$exports);





export {$3218793915077db0$export$a4a17273dffcc09c as useChain, $1649b9ecade4d58a$export$fe5dc7efc8443d0 as useChainWallet, $fe91e0d198dcf521$export$ddf53f26a9d1c984 as useManager, $336a02e188ffb57f$export$79b48125021310c7 as useNameService, $1bb370a23e69a7ee$export$c34addee860b0acb as useWallet, $9884b0cff108e8d0$export$742c698ad1033029 as useWalletClient, $a4fafc3217ced689$export$f8e5db10e4e4ab77 as walletContext, $a4fafc3217ced689$export$685bdd2e4d4c3a69 as ChainProvider};
//# sourceMappingURL=cosmos-kit-react-lite.esm.js.map

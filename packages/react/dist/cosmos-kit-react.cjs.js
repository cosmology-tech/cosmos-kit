var $cXvhA$cosmoskitreactlite = require("@cosmos-kit/react-lite");
var $cXvhA$reactjsxruntime = require("react/jsx-runtime");
var $cXvhA$cosmologyuireact = require("@cosmology-ui/react");
var $cXvhA$cosmoskitcore = require("@cosmos-kit/core");
var $cXvhA$react = require("react");
var $cXvhA$reacticonsfa = require("react-icons/fa");
var $cXvhA$reacticonsgo = require("react-icons/go");
var $cXvhA$reacticonsgr = require("react-icons/gr");
var $cXvhA$reacticonsri = require("react-icons/ri");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "DefaultModal", function () { return $c6bd8f581e162319$export$face2e55684cd9de; });
$parcel$export(module.exports, "WalletModal", function () { return $c6bd8f581e162319$export$851b8e4aa786e6a1; });
$parcel$export(module.exports, "ChainProvider", function () { return $9d21715259e2c709$export$685bdd2e4d4c3a69; });
$parcel$export(module.exports, "useChain", function () { return $bddab70a6700bf9a$re_export$useChain; });
$parcel$export(module.exports, "useChainWallet", function () { return $bddab70a6700bf9a$re_export$useChainWallet; });
$parcel$export(module.exports, "useManager", function () { return $bddab70a6700bf9a$re_export$useManager; });
$parcel$export(module.exports, "useNameService", function () { return $bddab70a6700bf9a$re_export$useNameService; });
$parcel$export(module.exports, "useWallet", function () { return $bddab70a6700bf9a$re_export$useWallet; });
$parcel$export(module.exports, "useWalletClient", function () { return $bddab70a6700bf9a$re_export$useWalletClient; });
$parcel$export(module.exports, "walletContext", function () { return $bddab70a6700bf9a$re_export$walletContext; });






function $9b474a343f0ccb84$export$e612ec082dda38({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: walletInfo , username: username , address: address  } = wallet;
    const onDisconnect = ()=>wallet.disconnect(true);
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: walletInfo.prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalStatus), {
        wallet: {
            name: walletInfo.name,
            prettyName: walletInfo.prettyName,
            logo: walletInfo.logo,
            isMobile: walletInfo.mode === "wallet-connect",
            mobileDisabled: walletInfo.mobileDisabled
        },
        status: "Connected",
        connectedInfo: {
            name: username,
            avatarUrl: "",
            address: address
        },
        onDisconnect: onDisconnect
    });
    return {
        head: modalHead,
        content: modalContent
    };
}




function $afa0cafa97ecc258$export$34867de9ea378686({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName , mode: mode  } , message: message  } = wallet;
    let title = "Requesting Connection";
    let desc = mode === "wallet-connect" ? `Approve ${prettyName} connection request on your mobile.` : `Open the ${prettyName} browser extension to connect your wallet.`;
    if (message === "InitClient") {
        title = "Initializing Wallet Client";
        desc = "";
    }
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalStatus), {
        status: "Connecting",
        wallet: {
            name: wallet.walletInfo.name,
            prettyName: wallet.walletInfo.prettyName,
            logo: wallet.walletInfo.logo,
            isMobile: wallet.walletInfo.mode === "wallet-connect",
            mobileDisabled: wallet.walletInfo.mobileDisabled
        },
        contentHeader: title,
        contentDesc: desc
    });
    return {
        head: modalHead,
        content: modalContent
    };
}




function $e6414200955155d8$export$8c68b6013ae44ca6({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName , logo: logo  } , message: message  } = wallet;
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalStatus), {
        status: "Error",
        wallet: {
            name: wallet.walletInfo.name,
            prettyName: wallet.walletInfo.prettyName,
            logo: wallet.walletInfo.logo,
            isMobile: wallet.walletInfo.mode === "wallet-connect",
            mobileDisabled: wallet.walletInfo.mobileDisabled
        },
        contentHeader: "Oops! Something wrong...",
        contentDesc: message,
        onChangeWallet: onReturn
    });
    return {
        head: modalHead,
        content: modalContent
    };
}








function $9de7489f55400ead$export$c151fb6ac5a51fb({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  } , downloadInfo: downloadInfo  } = wallet;
    const onInstall = ()=>{
        window.open(downloadInfo?.link, "_blank");
    };
    const IconComp = $9de7489f55400ead$var$getIcon(downloadInfo);
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalStatus), {
        status: "NotExist",
        wallet: {
            name: wallet.walletInfo.name,
            prettyName: wallet.walletInfo.prettyName,
            logo: wallet.walletInfo.logo,
            isMobile: wallet.walletInfo.mode === "wallet-connect",
            mobileDisabled: wallet.walletInfo.mobileDisabled
        },
        contentHeader: `${prettyName} Not Installed`,
        contentDesc: onInstall ? `If ${prettyName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instruction.` : `Download link not provided. Try searching it or consulting the developer team.`,
        onInstall: onInstall,
        installIcon: /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)(IconComp, {}),
        disableInstall: !downloadInfo?.link
    });
    return {
        head: modalHead,
        content: modalContent
    };
}
function $9de7489f55400ead$var$getIcon(downloadInfo) {
    if (downloadInfo?.browser === "chrome") return 0, $cXvhA$reacticonsri.RiChromeFill;
    if (downloadInfo?.browser === "firefox") return 0, $cXvhA$reacticonsgr.GrFirefox;
    if (downloadInfo?.os === "android") return 0, $cXvhA$reacticonsfa.FaAndroid;
    if (downloadInfo?.os === "ios") return 0, $cXvhA$reacticonsri.RiAppStoreFill;
    return 0, $cXvhA$reacticonsgo.GoDesktopDownload;
}





function $6ccda52a5520caf0$export$97002313aad2571d({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  } , qrUrl: { data: data , state: state , message: message  }  } = wallet;
    function getParts() {
        let desc = `Open ${prettyName} App to Scan`;
        let errorTitle, errorDesc;
        if (state === "Error") {
            desc = void 0;
            if (message === (0, $cXvhA$cosmoskitcore.ExpiredError).message) {
                errorTitle = "QRCode Expired";
                errorDesc = "Click to refresh.";
            } else {
                errorTitle = "QRCode Error";
                errorDesc = message;
            }
        }
        let status;
        switch(state){
            case (0, $cXvhA$cosmoskitcore.State).Pending:
                status = "Pending";
                break;
            case (0, $cXvhA$cosmoskitcore.State).Done:
                status = "Done";
                break;
            case (0, $cXvhA$cosmoskitcore.State).Error:
                if (message === (0, $cXvhA$cosmoskitcore.ExpiredError).message) status = "Expired";
                else status = "Error";
                break;
            default:
                status = "Error";
        }
        return {
            desc: desc,
            errorTitle: errorTitle,
            errorDesc: errorDesc,
            status: status
        };
    }
    const { desc: desc , errorTitle: errorTitle , errorDesc: errorDesc , status: status  } = getParts();
    const onRefresh = ()=>{
        wallet.connect(false);
    };
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalQRCode), {
        status: status,
        link: data || "",
        description: desc,
        errorTitle: errorTitle,
        errorDesc: errorDesc,
        onRefresh: onRefresh
    });
    return {
        head: modalHead,
        content: modalContent
    };
}




function $387992d78e8a1f46$export$39572041ab514c56({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  }  } = wallet;
    const onReconnect = ()=>{
        wallet.connect(false);
    };
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalStatus), {
        status: "Rejected",
        wallet: {
            name: wallet.walletInfo.name,
            prettyName: wallet.walletInfo.prettyName,
            logo: wallet.walletInfo.logo,
            isMobile: wallet.walletInfo.mode === "wallet-connect",
            mobileDisabled: wallet.walletInfo.mobileDisabled
        },
        contentHeader: "Request Rejected",
        contentDesc: wallet.rejectMessageTarget || "Connection permission is denied.",
        onConnect: onReconnect
    });
    return {
        head: modalHead,
        content: modalContent
    };
}





const $702a32b52d83ae5f$var$DynamicWalletList = ({ wallets: wallets , onClose: onClose  })=>{
    const [isLargeScreen, setIsLargeScreen] = (0, $cXvhA$react.useState)(true);
    const onWalletClicked = (0, $cXvhA$react.useCallback)(async (wallet)=>{
        await wallet.connect(true);
        if (wallet.isWalletConnected) onClose();
    }, []);
    (0, $cXvhA$react.useEffect)(()=>{
        const handleWindowResize = ()=>{
            if (window.innerWidth >= 768) setIsLargeScreen(true);
            else setIsLargeScreen(false);
        };
        handleWindowResize();
        window.addEventListener("resize", handleWindowResize);
        return ()=>{
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);
    const walletsData = (0, $cXvhA$react.useMemo)(()=>wallets.sort((a, b)=>{
            if (a.walletInfo.mode === b.walletInfo.mode) return 0;
            else if (a.walletInfo.mode !== "wallet-connect") return -1;
            else return 1;
        }).map((wallet, i)=>({
                name: wallet.walletInfo.name,
                prettyName: wallet.walletInfo.prettyName,
                logo: wallet.walletInfo.logo,
                isMobile: wallet.walletInfo.mode === "wallet-connect",
                mobileDisabled: wallet.walletInfo.mobileDisabled,
                downloadUrl: "",
                originalWallet: wallet,
                buttonShape: i < 2 && isLargeScreen ? "square" : "list"
            })), [
        wallets,
        isLargeScreen
    ]);
    return /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalWalletList), {
        wallets: walletsData,
        onWalletItemClick: onWalletClicked
    });
};
const $702a32b52d83ae5f$export$ac2d69aef846cc0 = ({ onClose: onClose , wallets: wallets , initialFocus: initialFocus  })=>{
    const modalHead = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ConnectModalHead), {
        title: "Select your wallet",
        hasBackButton: false,
        onClose: onClose
    });
    const modalContent = /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)($702a32b52d83ae5f$var$DynamicWalletList, {
        wallets: wallets,
        onClose: onClose
    });
    return {
        head: modalHead,
        content: modalContent
    };
};


const $26fe1de92271a804$export$5ba4929d31fc8c5e = {
    Connecting: (0, $afa0cafa97ecc258$export$34867de9ea378686),
    Connected: (0, $9b474a343f0ccb84$export$e612ec082dda38),
    Error: (0, $e6414200955155d8$export$8c68b6013ae44ca6),
    NotExist: (0, $9de7489f55400ead$export$c151fb6ac5a51fb),
    Rejected: (0, $387992d78e8a1f46$export$39572041ab514c56),
    QRCode: (0, $6ccda52a5520caf0$export$97002313aad2571d),
    WalletList: (0, $702a32b52d83ae5f$export$ac2d69aef846cc0)
};











const $c6bd8f581e162319$export$851b8e4aa786e6a1 = ({ isOpen: isOpen , setOpen: setOpen , walletRepo: walletRepo , modalViews: modalViews , includeAllWalletsOnMobile: includeAllWalletsOnMobile  })=>{
    const initialFocus = (0, $cXvhA$react.useRef)();
    const [currentView, setCurrentView] = (0, $cXvhA$react.useState)((0, $cXvhA$cosmoskitcore.ModalView).WalletList);
    const [qrState, setQRState] = (0, $cXvhA$react.useState)((0, $cXvhA$cosmoskitcore.State).Init); // state of QRCode
    const [qrMsg, setQRMsg] = (0, $cXvhA$react.useState)(""); // message of QRCode error
    const current = walletRepo?.current;
    (current?.client)?.setActions?.({
        qrUrl: {
            state: setQRState,
            message: setQRMsg
        }
    });
    const walletStatus = current?.walletStatus;
    const message = current?.message;
    (0, $cXvhA$react.useEffect)(()=>{
        if (isOpen) switch(walletStatus){
            case (0, $cXvhA$cosmoskitcore.WalletStatus).Connecting:
                if (qrState === (0, $cXvhA$cosmoskitcore.State).Init) setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).Connecting);
                else setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).QRCode);
                break;
            case (0, $cXvhA$cosmoskitcore.WalletStatus).Connected:
                setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).Connected);
                break;
            case (0, $cXvhA$cosmoskitcore.WalletStatus).Error:
                if (qrState === (0, $cXvhA$cosmoskitcore.State).Init) setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).Error);
                else setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).QRCode);
                break;
            case (0, $cXvhA$cosmoskitcore.WalletStatus).Rejected:
                setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).Rejected);
                break;
            case (0, $cXvhA$cosmoskitcore.WalletStatus).NotExist:
                setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).NotExist);
                break;
            case (0, $cXvhA$cosmoskitcore.WalletStatus).Disconnected:
                setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).WalletList);
                break;
            default:
                setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).WalletList);
                break;
        }
    }, [
        isOpen,
        qrState,
        walletStatus,
        qrMsg,
        message
    ]);
    const onCloseModal = (0, $cXvhA$react.useCallback)(()=>{
        setOpen(false);
        if (walletStatus === "Connecting") current?.disconnect();
    }, [
        setOpen,
        walletStatus,
        current
    ]);
    const onReturn = (0, $cXvhA$react.useCallback)(()=>{
        setCurrentView((0, $cXvhA$cosmoskitcore.ModalView).WalletList);
    }, [
        setCurrentView
    ]);
    const wallets = (0, $cXvhA$react.useMemo)(()=>walletRepo?.isMobile && !includeAllWalletsOnMobile ? walletRepo?.wallets.filter((w)=>!w.walletInfo.mobileDisabled) : walletRepo?.wallets, [
        walletRepo,
        includeAllWalletsOnMobile
    ]);
    const modalView = (0, $cXvhA$react.useMemo)(()=>{
        const getImplementation = modalViews[`${currentView}`];
        switch(currentView){
            case (0, $cXvhA$cosmoskitcore.ModalView).WalletList:
                return getImplementation({
                    onClose: onCloseModal,
                    wallets: wallets || [],
                    initialFocus: initialFocus
                });
            default:
                if (!current) return {
                    head: null,
                    content: null
                };
                return getImplementation({
                    onClose: onCloseModal,
                    onReturn: onReturn,
                    wallet: current
                });
        }
    }, [
        currentView,
        onReturn,
        onCloseModal,
        current,
        qrState,
        walletStatus,
        walletRepo,
        message,
        qrMsg
    ]);
    return /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmologyuireact.ThemeProvider), {
        children: /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)("span", {
            children: "hello"
        })
    });
};
const $c6bd8f581e162319$export$face2e55684cd9de = ({ isOpen: isOpen , setOpen: setOpen , walletRepo: walletRepo  })=>{
    return /*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)($c6bd8f581e162319$export$851b8e4aa786e6a1, {
        isOpen: isOpen,
        setOpen: setOpen,
        walletRepo: walletRepo,
        modalViews: (0, $26fe1de92271a804$export$5ba4929d31fc8c5e)
    });
};










const $9d21715259e2c709$export$685bdd2e4d4c3a69 = ({ chains: chains , assetLists: assetLists , wallets: wallets , walletModal: walletModal , modalViews: modalViews , throwErrors: throwErrors = false , defaultNameService: defaultNameService = "icns" , walletConnectOptions: walletConnectOptions , signerOptions: signerOptions , endpointOptions: endpointOptions , sessionOptions: sessionOptions , logLevel: logLevel = "WARN" , children: children  })=>{
    const logger = (0, $cXvhA$react.useMemo)(()=>new (0, $cXvhA$cosmoskitcore.Logger)(logLevel), []);
    const getChainProvider = (modal)=>/*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $cXvhA$cosmoskitreactlite.ChainProvider), {
            chains: chains,
            assetLists: assetLists,
            wallets: wallets,
            walletModal: modal,
            throwErrors: throwErrors,
            defaultNameService: defaultNameService,
            walletConnectOptions: walletConnectOptions,
            signerOptions: signerOptions,
            endpointOptions: endpointOptions,
            sessionOptions: sessionOptions,
            logLevel: logLevel,
            children: children
        });
    if (walletModal) {
        logger.debug("Using provided wallet modal.");
        return getChainProvider(walletModal);
    }
    logger.debug("Using default wallet modal.");
    const defaultModal = (0, $cXvhA$react.useCallback)((props)=>/*#__PURE__*/ (0, $cXvhA$reactjsxruntime.jsx)((0, $c6bd8f581e162319$export$851b8e4aa786e6a1), {
            ...props,
            modalViews: {
                ...(0, $26fe1de92271a804$export$5ba4929d31fc8c5e),
                ...modalViews
            }
        }), [
        (0, $26fe1de92271a804$export$5ba4929d31fc8c5e)
    ]);
    logger.debug("Wrap with <ChakraProviderWithGivenTheme>.");
    return getChainProvider(defaultModal);
};





//# sourceMappingURL=cosmos-kit-react.cjs.js.map

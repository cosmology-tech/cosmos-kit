import {useChain as $d8f64ccb54944387$re_export$useChain, useChainWallet as $d8f64ccb54944387$re_export$useChainWallet, useManager as $d8f64ccb54944387$re_export$useManager, useNameService as $d8f64ccb54944387$re_export$useNameService, useWallet as $d8f64ccb54944387$re_export$useWallet, useWalletClient as $d8f64ccb54944387$re_export$useWalletClient, walletContext as $d8f64ccb54944387$re_export$walletContext, ChainProvider as $3NIO4$ChainProvider} from "@cosmos-kit/react-lite";
import {jsx as $3NIO4$jsx} from "react/jsx-runtime";
import {ThemeProvider as $3NIO4$ThemeProvider, ConnectModalHead as $3NIO4$ConnectModalHead, ConnectModalStatus as $3NIO4$ConnectModalStatus, ConnectModalQRCode as $3NIO4$ConnectModalQRCode, ConnectModalWalletList as $3NIO4$ConnectModalWalletList} from "@cosmology-ui/react";
import {ModalView as $3NIO4$ModalView, State as $3NIO4$State, WalletStatus as $3NIO4$WalletStatus, ExpiredError as $3NIO4$ExpiredError, Logger as $3NIO4$Logger} from "@cosmos-kit/core";
import {useRef as $3NIO4$useRef, useState as $3NIO4$useState, useEffect as $3NIO4$useEffect, useCallback as $3NIO4$useCallback, useMemo as $3NIO4$useMemo} from "react";
import {FaAndroid as $3NIO4$FaAndroid} from "react-icons/fa";
import {GoDesktopDownload as $3NIO4$GoDesktopDownload} from "react-icons/go";
import {GrFirefox as $3NIO4$GrFirefox} from "react-icons/gr";
import {RiChromeFill as $3NIO4$RiChromeFill, RiAppStoreFill as $3NIO4$RiAppStoreFill} from "react-icons/ri";







function $b5fd602e198e0b50$export$e612ec082dda38({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: walletInfo , username: username , address: address  } = wallet;
    const onDisconnect = ()=>wallet.disconnect(true);
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: walletInfo.prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalStatus), {
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




function $549302da03ba8877$export$34867de9ea378686({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName , mode: mode  } , message: message  } = wallet;
    let title = "Requesting Connection";
    let desc = mode === "wallet-connect" ? `Approve ${prettyName} connection request on your mobile.` : `Open the ${prettyName} browser extension to connect your wallet.`;
    if (message === "InitClient") {
        title = "Initializing Wallet Client";
        desc = "";
    }
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalStatus), {
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




function $48139d3c5e307f8b$export$8c68b6013ae44ca6({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName , logo: logo  } , message: message  } = wallet;
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalStatus), {
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








function $93ea60f5836769ad$export$c151fb6ac5a51fb({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  } , downloadInfo: downloadInfo  } = wallet;
    const onInstall = ()=>{
        window.open(downloadInfo?.link, "_blank");
    };
    const IconComp = $93ea60f5836769ad$var$getIcon(downloadInfo);
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalStatus), {
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
        installIcon: /*#__PURE__*/ (0, $3NIO4$jsx)(IconComp, {}),
        disableInstall: !downloadInfo?.link
    });
    return {
        head: modalHead,
        content: modalContent
    };
}
function $93ea60f5836769ad$var$getIcon(downloadInfo) {
    if (downloadInfo?.browser === "chrome") return 0, $3NIO4$RiChromeFill;
    if (downloadInfo?.browser === "firefox") return 0, $3NIO4$GrFirefox;
    if (downloadInfo?.os === "android") return 0, $3NIO4$FaAndroid;
    if (downloadInfo?.os === "ios") return 0, $3NIO4$RiAppStoreFill;
    return 0, $3NIO4$GoDesktopDownload;
}





function $c11eb070fdff6f6e$export$97002313aad2571d({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  } , qrUrl: { data: data , state: state , message: message  }  } = wallet;
    function getParts() {
        let desc = `Open ${prettyName} App to Scan`;
        let errorTitle, errorDesc;
        if (state === "Error") {
            desc = void 0;
            if (message === (0, $3NIO4$ExpiredError).message) {
                errorTitle = "QRCode Expired";
                errorDesc = "Click to refresh.";
            } else {
                errorTitle = "QRCode Error";
                errorDesc = message;
            }
        }
        let status;
        switch(state){
            case (0, $3NIO4$State).Pending:
                status = "Pending";
                break;
            case (0, $3NIO4$State).Done:
                status = "Done";
                break;
            case (0, $3NIO4$State).Error:
                if (message === (0, $3NIO4$ExpiredError).message) status = "Expired";
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
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalQRCode), {
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




function $5f080652e506ac3b$export$39572041ab514c56({ onClose: onClose , onReturn: onReturn , wallet: wallet  }) {
    const { walletInfo: { prettyName: prettyName  }  } = wallet;
    const onReconnect = ()=>{
        wallet.connect(false);
    };
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: prettyName,
        hasBackButton: true,
        onClose: onClose,
        onBack: onReturn
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalStatus), {
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





const $2aaf18345dd8b26e$var$DynamicWalletList = ({ wallets: wallets , onClose: onClose  })=>{
    const [isLargeScreen, setIsLargeScreen] = (0, $3NIO4$useState)(true);
    const onWalletClicked = (0, $3NIO4$useCallback)(async (wallet)=>{
        await wallet.connect(true);
        if (wallet.isWalletConnected) onClose();
    }, []);
    (0, $3NIO4$useEffect)(()=>{
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
    const walletsData = (0, $3NIO4$useMemo)(()=>wallets.sort((a, b)=>{
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
    return /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalWalletList), {
        wallets: walletsData,
        onWalletItemClick: onWalletClicked
    });
};
const $2aaf18345dd8b26e$export$ac2d69aef846cc0 = ({ onClose: onClose , wallets: wallets , initialFocus: initialFocus  })=>{
    const modalHead = /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ConnectModalHead), {
        title: "Select your wallet",
        hasBackButton: false,
        onClose: onClose
    });
    const modalContent = /*#__PURE__*/ (0, $3NIO4$jsx)($2aaf18345dd8b26e$var$DynamicWalletList, {
        wallets: wallets,
        onClose: onClose
    });
    return {
        head: modalHead,
        content: modalContent
    };
};


const $56d69779c2616e8e$export$5ba4929d31fc8c5e = {
    Connecting: (0, $549302da03ba8877$export$34867de9ea378686),
    Connected: (0, $b5fd602e198e0b50$export$e612ec082dda38),
    Error: (0, $48139d3c5e307f8b$export$8c68b6013ae44ca6),
    NotExist: (0, $93ea60f5836769ad$export$c151fb6ac5a51fb),
    Rejected: (0, $5f080652e506ac3b$export$39572041ab514c56),
    QRCode: (0, $c11eb070fdff6f6e$export$97002313aad2571d),
    WalletList: (0, $2aaf18345dd8b26e$export$ac2d69aef846cc0)
};











const $b9da0a277e7110a9$export$851b8e4aa786e6a1 = ({ isOpen: isOpen , setOpen: setOpen , walletRepo: walletRepo , modalViews: modalViews , includeAllWalletsOnMobile: includeAllWalletsOnMobile  })=>{
    const initialFocus = (0, $3NIO4$useRef)();
    const [currentView, setCurrentView] = (0, $3NIO4$useState)((0, $3NIO4$ModalView).WalletList);
    const [qrState, setQRState] = (0, $3NIO4$useState)((0, $3NIO4$State).Init); // state of QRCode
    const [qrMsg, setQRMsg] = (0, $3NIO4$useState)(""); // message of QRCode error
    const current = walletRepo?.current;
    (current?.client)?.setActions?.({
        qrUrl: {
            state: setQRState,
            message: setQRMsg
        }
    });
    const walletStatus = current?.walletStatus;
    const message = current?.message;
    (0, $3NIO4$useEffect)(()=>{
        if (isOpen) switch(walletStatus){
            case (0, $3NIO4$WalletStatus).Connecting:
                if (qrState === (0, $3NIO4$State).Init) setCurrentView((0, $3NIO4$ModalView).Connecting);
                else setCurrentView((0, $3NIO4$ModalView).QRCode);
                break;
            case (0, $3NIO4$WalletStatus).Connected:
                setCurrentView((0, $3NIO4$ModalView).Connected);
                break;
            case (0, $3NIO4$WalletStatus).Error:
                if (qrState === (0, $3NIO4$State).Init) setCurrentView((0, $3NIO4$ModalView).Error);
                else setCurrentView((0, $3NIO4$ModalView).QRCode);
                break;
            case (0, $3NIO4$WalletStatus).Rejected:
                setCurrentView((0, $3NIO4$ModalView).Rejected);
                break;
            case (0, $3NIO4$WalletStatus).NotExist:
                setCurrentView((0, $3NIO4$ModalView).NotExist);
                break;
            case (0, $3NIO4$WalletStatus).Disconnected:
                setCurrentView((0, $3NIO4$ModalView).WalletList);
                break;
            default:
                setCurrentView((0, $3NIO4$ModalView).WalletList);
                break;
        }
    }, [
        isOpen,
        qrState,
        walletStatus,
        qrMsg,
        message
    ]);
    const onCloseModal = (0, $3NIO4$useCallback)(()=>{
        setOpen(false);
        if (walletStatus === "Connecting") current?.disconnect();
    }, [
        setOpen,
        walletStatus,
        current
    ]);
    const onReturn = (0, $3NIO4$useCallback)(()=>{
        setCurrentView((0, $3NIO4$ModalView).WalletList);
    }, [
        setCurrentView
    ]);
    const wallets = (0, $3NIO4$useMemo)(()=>walletRepo?.isMobile && !includeAllWalletsOnMobile ? walletRepo?.wallets.filter((w)=>!w.walletInfo.mobileDisabled) : walletRepo?.wallets, [
        walletRepo,
        includeAllWalletsOnMobile
    ]);
    const modalView = (0, $3NIO4$useMemo)(()=>{
        const getImplementation = modalViews[`${currentView}`];
        switch(currentView){
            case (0, $3NIO4$ModalView).WalletList:
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
    return /*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ThemeProvider), {
        children: /*#__PURE__*/ (0, $3NIO4$jsx)("span", {
            children: "hello"
        })
    });
};
const $b9da0a277e7110a9$export$face2e55684cd9de = ({ isOpen: isOpen , setOpen: setOpen , walletRepo: walletRepo  })=>{
    return /*#__PURE__*/ (0, $3NIO4$jsx)($b9da0a277e7110a9$export$851b8e4aa786e6a1, {
        isOpen: isOpen,
        setOpen: setOpen,
        walletRepo: walletRepo,
        modalViews: (0, $56d69779c2616e8e$export$5ba4929d31fc8c5e)
    });
};










const $cf74427c4b4ae9a2$export$685bdd2e4d4c3a69 = ({ chains: chains , assetLists: assetLists , wallets: wallets , walletModal: walletModal , modalViews: modalViews , throwErrors: throwErrors = false , defaultNameService: defaultNameService = "icns" , walletConnectOptions: walletConnectOptions , signerOptions: signerOptions , endpointOptions: endpointOptions , sessionOptions: sessionOptions , logLevel: logLevel = "WARN" , children: children  })=>{
    const logger = (0, $3NIO4$useMemo)(()=>new (0, $3NIO4$Logger)(logLevel), []);
    const getChainProvider = (modal)=>/*#__PURE__*/ (0, $3NIO4$jsx)((0, $3NIO4$ChainProvider), {
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
    const defaultModal = (0, $3NIO4$useCallback)((props)=>/*#__PURE__*/ (0, $3NIO4$jsx)((0, $b9da0a277e7110a9$export$851b8e4aa786e6a1), {
            ...props,
            modalViews: {
                ...(0, $56d69779c2616e8e$export$5ba4929d31fc8c5e),
                ...modalViews
            }
        }), [
        (0, $56d69779c2616e8e$export$5ba4929d31fc8c5e)
    ]);
    logger.debug("Wrap with <ChakraProviderWithGivenTheme>.");
    return getChainProvider(defaultModal);
};





export {$b9da0a277e7110a9$export$face2e55684cd9de as DefaultModal, $b9da0a277e7110a9$export$851b8e4aa786e6a1 as WalletModal, $cf74427c4b4ae9a2$export$685bdd2e4d4c3a69 as ChainProvider, $d8f64ccb54944387$re_export$useChain as useChain, $d8f64ccb54944387$re_export$useChainWallet as useChainWallet, $d8f64ccb54944387$re_export$useManager as useManager, $d8f64ccb54944387$re_export$useNameService as useNameService, $d8f64ccb54944387$re_export$useWallet as useWallet, $d8f64ccb54944387$re_export$useWalletClient as useWalletClient, $d8f64ccb54944387$re_export$walletContext as walletContext};
//# sourceMappingURL=cosmos-kit-react.esm.js.map

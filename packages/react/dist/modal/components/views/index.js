var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modal/components/views/index.ts
var views_exports = {};
__export(views_exports, {
  ConnectedView: () => ConnectedView,
  ConnectingView: () => ConnectingView,
  ErrorView: () => ErrorView,
  NotExistView: () => NotExistView,
  QRCodeView: () => QRCodeView,
  RejectedView: () => RejectedView,
  WalletListView: () => WalletListView,
  defaultModalViews: () => defaultModalViews
});
module.exports = __toCommonJS(views_exports);

// src/modal/components/views/Connected.tsx
var import_react = require("@chakra-ui/react");
var import_react2 = require("@cosmology-ui/react");
var import_react3 = require("react");
var import_ri = require("react-icons/ri");
var import_jsx_runtime = require("react/jsx-runtime");
var ConnectedView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo },
    username,
    address
  } = wallet;
  const onDisconnect = (0, import_react3.useCallback)(() => wallet.disconnect(true), [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react2.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react2.SimpleDisplayModalContent,
    {
      logo: import_react2.Astronaut,
      username,
      walletIcon: logo,
      addressButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.CopyAddressButton, { address }),
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react2.ConnectWalletButton,
        {
          leftIcon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Icon, { as: import_ri.RiDoorOpenFill }),
          buttonText: "Disconnect",
          onClick: onDisconnect
        }
      ) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react2.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Connecting.tsx
var import_react4 = require("@cosmology-ui/react");
var import_jsx_runtime2 = require("react/jsx-runtime");
var ConnectingView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo, mode },
    message
  } = wallet;
  let title = "Requesting Connection";
  let desc = mode === "wallet-connect" ? `Approve ${prettyName} connection request on your mobile.` : `Open the ${prettyName} browser extension to connect your wallet.`;
  if (message === "InitClient") {
    title = "Initializing Wallet Client";
    desc = "";
  }
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react4.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react4.SimpleDisplayModalContent,
    {
      status: import_react4.LogoStatus.Loading,
      logo,
      contentHeader: title,
      contentDesc: desc
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react4.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Error.tsx
var import_react5 = require("@chakra-ui/react");
var import_react6 = require("@cosmology-ui/react");
var import_jsx_runtime3 = require("react/jsx-runtime");
var ErrorView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName, logo },
    message
  } = wallet;
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_react6.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_react6.SimpleDisplayModalContent,
    {
      status: import_react6.LogoStatus.Error,
      logo,
      contentHeader: "Oops! Something wrong...",
      contentDesc: message,
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react5.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_react6.ConnectWalletButton,
        {
          buttonText: "Change Wallet",
          onClick: onReturn
        }
      ) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react6.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/NotExist.tsx
var import_react7 = require("@cosmology-ui/react");
var import_react8 = require("react");
var import_go = require("react-icons/go");
var import_ri2 = require("react-icons/ri");
var import_fa = require("react-icons/fa");
var import_ri3 = require("react-icons/ri");
var import_gr = require("react-icons/gr");
var import_jsx_runtime4 = require("react/jsx-runtime");
var NotExistView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo },
    downloadInfo
  } = wallet;
  const onInstall = (0, import_react8.useCallback)(() => {
    window.open(downloadInfo?.link, "_blank");
  }, [downloadInfo]);
  const icon = (0, import_react8.useMemo)(() => {
    if (downloadInfo?.browser === "chrome")
      return import_ri2.RiChromeFill;
    if (downloadInfo?.browser === "firefox")
      return import_gr.GrFirefox;
    if (downloadInfo?.os === "android")
      return import_fa.FaAndroid;
    if (downloadInfo?.os === "ios")
      return import_ri3.RiAppStoreFill;
    return import_go.GoDesktopDownload;
  }, [downloadInfo]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react7.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react7.SimpleDisplayModalContent,
    {
      status: import_react7.LogoStatus.Error,
      logo,
      contentHeader: `${prettyName} Not Installed`,
      contentDesc: onInstall ? `If ${prettyName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instruction.` : `Download link not provided. Try searching it or consulting the developer team.`,
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_react7.InstallWalletButton,
        {
          icon,
          buttonText: `Install ${prettyName}`,
          onClick: onInstall,
          disabled: !downloadInfo?.link
        }
      )
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react7.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/QRCode.tsx
var import_react9 = require("@cosmology-ui/react");
var import_core = require("@cosmos-kit/core");
var import_react10 = require("react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var QRCodeView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName },
    qrUrl: { data, state, message }
  } = wallet;
  const [desc, errorTitle, errorDesc, status] = (0, import_react10.useMemo)(() => {
    let desc2 = `Open ${prettyName} App to Scan`;
    let errorTitle2, errorDesc2;
    if (state === "Error") {
      desc2 = void 0;
      if (message === import_core.ExpiredError.message) {
        errorTitle2 = "QRCode Expired";
        errorDesc2 = "Click to refresh.";
      } else {
        errorTitle2 = "QRCode Error";
        errorDesc2 = message;
      }
    }
    let status2;
    switch (state) {
      case import_core.State.Pending:
        status2 = import_react9.QRCodeStatus.Pending;
        break;
      case import_core.State.Done:
        status2 = import_react9.QRCodeStatus.Done;
        break;
      case import_core.State.Error:
        if (message === import_core.ExpiredError.message) {
          status2 = import_react9.QRCodeStatus.Expired;
        } else {
          status2 = import_react9.QRCodeStatus.Error;
        }
        break;
      default:
        status2 = import_react9.QRCodeStatus.Error;
    }
    return [desc2, errorTitle2, errorDesc2, status2];
  }, [state, message]);
  const onRefresh = (0, import_react10.useCallback)(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react9.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react9.QRCode,
    {
      link: data || "",
      description: desc,
      errorTitle,
      errorDesc,
      onRefresh,
      status
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react9.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/WalletList.tsx
var import_react11 = require("@cosmology-ui/react");
var import_react12 = require("react");

// src/modal/constant.ts
var WC_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzg1IiBoZWlnaHQ9IjIzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxwYXRoIGQ9Ik03OC42NTAxIDQ2LjAwMDFjNjIuNjQ5OS02MS4zMSAxNjQuMjE5OS02MS4zMSAyMjYuODY5OSAwbDcuNTQgNy4zOGMuNzQzLjcyMDYgMS4zMzQgMS41ODMyIDEuNzM4IDIuNTM2Ni40MDQuOTUzNC42MTEgMS45NzgxLjYxMSAzLjAxMzQgMCAxLjAzNTMtLjIwNyAyLjA2LS42MTEgMy4wMTM0LS40MDQuOTUzNC0uOTk1IDEuODE2LTEuNzM4IDIuNTM2NmwtMjUuNzkgMjUuMjVjLS43NjEuNzM1LTEuNzc3IDEuMTQ1OC0yLjgzNSAxLjE0NThzLTIuMDc0LS40MTA4LTIuODM1LTEuMTQ1OGwtMTAuMzgtMTAuMTZjLTQzLjctNDIuNzctMTE0LjU3LTQyLjc3LTE1OC4yNyAwbC0xMS4xMSAxMC44OGMtLjc2Mi43MzU2LTEuNzggMS4xNDY4LTIuODM5OSAxLjE0NjgtMS4wNTk1IDAtMi4wNzc2LS40MTEyLTIuODQwMS0xLjE0NjhsLTI1Ljc4OTktMjUuMjVjLS43NDM0LS43MjA2LTEuMzM0NC0xLjU4MzItMS43Mzc5LTIuNTM2Ni0uNDAzNi0uOTUzNC0uNjExNi0xLjk3ODEtLjYxMTYtMy4wMTM0IDAtMS4wMzUzLjIwOC0yLjA2LjYxMTYtMy4wMTM0LjQwMzUtLjk1MzQuOTk0NS0xLjgxNiAxLjczNzktMi41MzY2bDguMjgtOC4xWm0yODAuMjA5OSA1Mi4yMSAyMyAyMi40NTk5Yy43NDIuNzIyIDEuMzMyIDEuNTg2IDEuNzM1IDIuNTRzLjYxMSAxLjk3OS42MTEgMy4wMTUtLjIwOCAyLjA2MS0uNjExIDMuMDE1Yy0uNDAzLjk1NC0uOTkzIDEuODE4LTEuNzM1IDIuNTRMMjc4LjMxIDIzMy4wNmMtMS41MiAxLjQ3Mi0zLjU1NCAyLjI5Ni01LjY3IDIuMjk2cy00LjE1LS44MjQtNS42Ny0yLjI5NmwtNzMuNDctNzEuOWMtLjE4Ni0uMTg2LS40MDYtLjMzMy0uNjQ5LS40MzQtLjI0My0uMTAxLS41MDMtLjE1Mi0uNzY2LS4xNTJzLS41MjMuMDUxLS43NjYuMTUyLS40NjMuMjQ4LS42NDkuNDM0bC03My40NiA3MS45Yy0xLjUyMiAxLjQ3My0zLjU1NyAyLjI5Ny01LjY3NSAyLjI5N3MtNC4xNTMtLjgyNC01LjY3NS0yLjI5N0wyLjM1MDA1IDEzMS43NWMtLjc0MzMxLS43MjEtMS4zMzQzLTEuNTgzLTEuNzM3ODg2LTIuNTM3LS40MDM1ODgtLjk1My0uNjExNTUzNjUtMS45NzgtLjYxMTU1MzY1LTMuMDEzcy4yMDc5NjU2NS0yLjA2LjYxMTU1MzY1LTMuMDEzYy40MDM1ODYtLjk1NC45OTQ1NzYtMS44MTYgMS43Mzc4ODYtMi41MzdMMjUuMzUwMSA5OC4xOTAxYzEuNTE3OC0xLjQ3NzEgMy41NTIxLTIuMzAzNSA1LjY3LTIuMzAzNSAyLjExNzggMCA0LjE1MjEuODI2NCA1LjY3IDIuMzAzNUwxMTAuMTYgMTcwLjA4Yy4xODYuMTg2LjQwNi4zMzQuNjQ5LjQzNC4yNDMuMTAxLjUwMy4xNTMuNzY2LjE1M3MuNTIzLS4wNTIuNzY2LS4xNTNjLjI0My0uMS40NjMtLjI0OC42NDktLjQzNGw3My40Ni03MS44ODk5YzEuNTItMS40Nzc3IDMuNTU2LTIuMzA0NCA1LjY3NS0yLjMwNDQgMi4xMiAwIDQuMTU2LjgyNjcgNS42NzUgMi4zMDQ0bDczLjQ2IDcxLjg4OTljLjE4Ni4xODguNDA3LjMzNi42NTEuNDM4LjI0NC4xMDEuNTA1LjE1NC43NjkuMTU0cy41MjUtLjA1My43NjktLjE1NGMuMjQ0LS4xMDIuNDY1LS4yNS42NTEtLjQzOGw3My40Ni03MS44ODk5YzEuNTE4LTEuNDc3MSAzLjU1Mi0yLjMwMzUgNS42Ny0yLjMwMzVzNC4xNTIuODI2NCA1LjY3IDIuMzAzNWwtLjA0LjAyWiIgZmlsbD0iIzMzOTZGRiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMzg0LjE3djIzNS4zNUgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";

// src/modal/components/views/WalletList.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var WalletListView = ({
  onClose,
  wallets,
  initialFocus
}) => {
  const defaultInitialFocus = (0, import_react12.useRef)();
  const [isLargeScreen, setIsLargeScreen] = (0, import_react12.useState)(true);
  const onWalletClicked = (0, import_react12.useCallback)(async (wallet) => {
    await wallet.connect(true);
    if (wallet.isWalletConnected) {
      onClose();
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= 768) {
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react11.SimpleModalHead,
    {
      title: "Select your wallet",
      backButton: false,
      onClose
    }
  );
  const walletsData = (0, import_react12.useMemo)(
    () => wallets.sort((a, b) => {
      if (a.walletInfo.mode === b.walletInfo.mode) {
        return 0;
      } else if (a.walletInfo.mode !== "wallet-connect") {
        return -1;
      } else {
        return 1;
      }
    }).map(
      (w, i) => ({
        ...w.walletInfo,
        downloads: void 0,
        onClick: async () => {
          onWalletClicked(w);
        },
        buttonShape: i < 2 && isLargeScreen ? "Square" : "Rectangle",
        subLogo: w.walletInfo.mode === "wallet-connect" ? WC_ICON : void 0
      })
    ),
    [wallets, isLargeScreen]
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react11.SimpleDisplayWalletList,
    {
      initialFocus: initialFocus || defaultInitialFocus,
      walletsData
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react11.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Rejected.tsx
var import_react13 = require("@chakra-ui/react");
var import_react14 = require("@cosmology-ui/react");
var import_react15 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var RejectedView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo }
  } = wallet;
  const onReconnect = (0, import_react15.useCallback)(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_react14.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_react14.SimpleDisplayModalContent,
    {
      status: import_react14.LogoStatus.Error,
      logo,
      contentHeader: "Request Rejected",
      contentDesc: wallet.rejectMessageTarget || "Connection permission is denied.",
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react13.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react14.ConnectWalletButton, { buttonText: "Reconnect", onClick: onReconnect }) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react14.SimpleModalView, { modalHead, modalContent });
};

// src/modal/config.tsx
var defaultModalViews = {
  Connecting: ConnectingView,
  Connected: ConnectedView,
  Error: ErrorView,
  NotExist: NotExistView,
  Rejected: RejectedView,
  QRCode: QRCodeView,
  WalletList: WalletListView
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConnectedView,
  ConnectingView,
  ErrorView,
  NotExistView,
  QRCodeView,
  RejectedView,
  WalletListView,
  defaultModalViews
});
//# sourceMappingURL=index.js.map
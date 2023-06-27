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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  ChainProvider: () => ChainProvider,
  DefaultModal: () => DefaultModal,
  WalletModal: () => WalletModal,
  addSemanticTokens: () => addSemanticTokens,
  defaultTheme: () => defaultTheme,
  noCssResetTheme: () => noCssResetTheme,
  useChain: () => import_react_lite2.useChain,
  useChainWallet: () => import_react_lite2.useChainWallet,
  useManager: () => import_react_lite2.useManager,
  useModalTheme: () => useModalTheme,
  useNameService: () => import_react_lite2.useNameService,
  useWallet: () => import_react_lite2.useWallet,
  useWalletClient: () => import_react_lite2.useWalletClient,
  walletContext: () => import_react_lite2.walletContext
});
module.exports = __toCommonJS(src_exports);
var import_react_lite2 = require("@cosmos-kit/react-lite");

// src/modal/modal.tsx
var import_react22 = require("@cosmology-ui/react");
var import_core2 = require("@cosmos-kit/core");
var import_react23 = require("react");

// src/modal/components/theme-wrapper.tsx
var import_react3 = require("@chakra-ui/react");
var import_react4 = require("@cosmology-ui/react");
var import_react5 = require("@emotion/react");
var import_react6 = require("react");

// src/modal/theme.ts
var import_react = require("@chakra-ui/react");
var import_react2 = require("@cosmology-ui/react");
var config = {
  initialColorMode: "light",
  useSystemColorMode: true
};
var colors = {
  primary: {
    "50": "#e5e7f9",
    "100": "#bec4ef",
    "200": "#929ce4",
    "300": "#6674d9",
    "400": "#4657d1",
    "500": "#2539c9",
    "600": "#2133c3",
    "700": "#1b2cbc",
    "800": "#1624b5",
    "900": "#0d17a9"
  }
};
var themeWithoutReset = {
  styles: {
    global: {
      html: {
        fontFamily: "",
        transitionProperty: "",
        transitionDuration: "",
        lineHeight: "normal",
        WebkitTextSizeAdjust: "",
        WebkitFontSmoothing: "auto",
        textRendering: "",
        MozOsxFontSmoothing: "",
        touchAction: ""
      },
      body: {
        fontFamily: "",
        color: "",
        bg: "",
        position: "relative",
        minHeight: "100%",
        fontFeatureSettings: ""
      },
      "*::placeholder": {
        color: ""
      },
      "*, *::before, *::after": {
        borderWidth: "",
        borderStyle: "",
        boxSizing: ""
      },
      "*, *::before, &::after": {
        borderColor: "",
        wordWrap: ""
      },
      main: {
        display: ""
      },
      hr: {
        borderTopWidth: "",
        boxSizing: "",
        height: "",
        overflow: ""
      },
      "pre, code, kbd, samp": {
        fontFamily: "",
        fontSize: ""
      },
      a: {
        backgroundColor: "",
        color: "",
        textDecoration: ""
      },
      "abbr[title]": {
        borderBottom: "",
        WebkitTextDecoration: "",
        textDecoration: ""
      },
      "b, strong": {
        fontWeight: ""
      },
      small: {
        fontSize: ""
      },
      "sub, sup": {
        fontSize: "",
        lineHeight: "",
        position: "",
        verticalAlign: ""
      },
      sub: {
        bottom: ""
      },
      sup: {
        top: ""
      },
      img: {
        borderStyle: ""
      },
      "button, input, optgroup, select,textarea": {
        fontFamily: "",
        fontSize: "",
        lineHeight: "",
        margin: ""
      },
      "button, input": {
        overflow: ""
      },
      "button, select": {
        textTransform: ""
      },
      'button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner': {
        borderStyle: "",
        padding: ""
      },
      fieldset: {
        margin: "",
        padding: ""
      },
      legend: {
        boxSizing: "",
        color: "",
        display: "",
        maxWidth: "",
        padding: "",
        whiteSpace: ""
      },
      progress: {
        verticalAlign: ""
      },
      textarea: {
        overflow: "",
        resize: ""
      },
      '[type="checkbox"], [type="radio"]': {
        boxSizing: "",
        padding: ""
      },
      '[type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button': {
        WebkitAppearance: ""
      },
      'input[type="number"]': {
        MozAppearance: ""
      },
      '[type="search"]': {
        "-webkit-appearance": "",
        outlineOffset: ""
      },
      '[type="search"]::-webkit-search-decoration': {
        WebkitAppearance: ""
      },
      "::-webkit-file-upload-button": {
        WebkitAppearance: "",
        font: ""
      },
      details: {
        display: ""
      },
      summary: {
        display: ""
      },
      template: {
        display: ""
      },
      "[hidden]": {
        display: ""
      },
      "body, blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre": {
        margin: ""
      },
      button: {
        background: "",
        padding: ""
      },
      'button,[role="button"]': {
        cursor: ""
      },
      "button::-moz-focus-inner": {
        border: ""
      },
      table: {
        borderCollapse: ""
      },
      "ol, ul": {
        margin: "",
        padding: ""
      },
      "h1, h2, h3, h4, h5, h6": {
        fontSize: "",
        fontWeight: ""
      },
      "button, input, optgroup, select, textarea": {
        padding: "",
        lineHeight: "",
        color: ""
      },
      "img, svg, video, canvas, audio, iframe, embed, object": {
        display: ""
      },
      "img, video": {
        maxWidth: "",
        height: ""
      },
      "[data-js-focus-visible] :focus:not([data-focus-visible-added]):not([data-focus-visible-disabled])": {
        outline: "",
        boxShadow: ""
      },
      "select::-ms-expand": {
        display: ""
      }
    }
  },
  colors,
  config
};
var themeWithReset = {
  fonts: {
    body: "Inter, system-ui, sans-serif",
    heading: "Work Sans, system-ui, sans-serif"
  },
  colors,
  config
};
function addSemanticTokens(theme) {
  const colors2 = {
    ...import_react2.semanticTokens.semanticTokens.colors,
    ...theme?.semanticTokens?.colors
  };
  const shadows = {
    ...import_react2.semanticTokens.semanticTokens.shadows,
    ...theme?.semanticTokens?.shadows
  };
  const mergedSemanticTokens = {
    semanticTokens: {
      ...theme?.semanticTokens,
      colors: colors2,
      shadows
    }
  };
  return {
    ...(0, import_react.extendTheme)(themeWithReset),
    ...theme,
    ...mergedSemanticTokens
  };
}
var defaultTheme = addSemanticTokens((0, import_react.extendTheme)(themeWithReset));
var noCssResetTheme = addSemanticTokens(
  (0, import_react.extendTheme)(themeWithoutReset)
);

// src/modal/components/theme-wrapper.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function ChakraProviderWithOuterTheme({
  logger,
  children
}) {
  const outerTheme = (0, import_react6.useContext)(import_react5.ThemeContext);
  const theme = (0, import_react6.useMemo)(() => addSemanticTokens(outerTheme), [outerTheme]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react4.ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.ChakraProvider, { theme, resetCSS: true, children }) });
}
function ChakraProviderWithGivenTheme({
  theme,
  logger,
  children
}) {
  const _theme = (0, import_react6.useMemo)(() => {
    if (theme) {
      return addSemanticTokens(theme);
    } else {
      return noCssResetTheme;
    }
  }, [theme]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react4.ThemeProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react3.ChakraProvider, { theme: _theme, resetCSS: false, children }) });
}

// src/modal/components/views/Connected.tsx
var import_react7 = require("@chakra-ui/react");
var import_react8 = require("@cosmology-ui/react");
var import_react9 = require("react");
var import_ri = require("react-icons/ri");
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const onDisconnect = (0, import_react9.useCallback)(() => wallet.disconnect(true), [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react8.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react8.SimpleDisplayModalContent,
    {
      logo: import_react8.Astronaut,
      username,
      walletIcon: logo,
      addressButton: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react8.CopyAddressButton, { address }),
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react7.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        import_react8.ConnectWalletButton,
        {
          leftIcon: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react7.Icon, { as: import_ri.RiDoorOpenFill }),
          buttonText: "Disconnect",
          onClick: onDisconnect
        }
      ) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react8.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Connecting.tsx
var import_react10 = require("@cosmology-ui/react");
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_react10.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    import_react10.SimpleDisplayModalContent,
    {
      status: import_react10.LogoStatus.Loading,
      logo,
      contentHeader: title,
      contentDesc: desc
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react10.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Error.tsx
var import_react11 = require("@chakra-ui/react");
var import_react12 = require("@cosmology-ui/react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var ErrorView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName, logo },
    message
  } = wallet;
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react12.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_react12.SimpleDisplayModalContent,
    {
      status: import_react12.LogoStatus.Error,
      logo,
      contentHeader: "Oops! Something wrong...",
      contentDesc: message,
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react11.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_react12.ConnectWalletButton,
        {
          buttonText: "Change Wallet",
          onClick: onReturn
        }
      ) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_react12.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/NotExist.tsx
var import_react13 = require("@cosmology-ui/react");
var import_react14 = require("react");
var import_go = require("react-icons/go");
var import_ri2 = require("react-icons/ri");
var import_fa = require("react-icons/fa");
var import_ri3 = require("react-icons/ri");
var import_gr = require("react-icons/gr");
var import_jsx_runtime5 = require("react/jsx-runtime");
var NotExistView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo },
    downloadInfo
  } = wallet;
  const onInstall = (0, import_react14.useCallback)(() => {
    window.open(downloadInfo?.link, "_blank");
  }, [downloadInfo]);
  const icon = (0, import_react14.useMemo)(() => {
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
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react13.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react13.SimpleDisplayModalContent,
    {
      status: import_react13.LogoStatus.Error,
      logo,
      contentHeader: `${prettyName} Not Installed`,
      contentDesc: onInstall ? `If ${prettyName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instruction.` : `Download link not provided. Try searching it or consulting the developer team.`,
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        import_react13.InstallWalletButton,
        {
          icon,
          buttonText: `Install ${prettyName}`,
          onClick: onInstall,
          disabled: !downloadInfo?.link
        }
      )
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_react13.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/QRCode.tsx
var import_react15 = require("@cosmology-ui/react");
var import_core = require("@cosmos-kit/core");
var import_react16 = require("react");
var import_jsx_runtime6 = require("react/jsx-runtime");
var QRCodeView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName },
    qrUrl: { data, state, message }
  } = wallet;
  const [desc, errorTitle, errorDesc, status] = (0, import_react16.useMemo)(() => {
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
        status2 = import_react15.QRCodeStatus.Pending;
        break;
      case import_core.State.Done:
        status2 = import_react15.QRCodeStatus.Done;
        break;
      case import_core.State.Error:
        if (message === import_core.ExpiredError.message) {
          status2 = import_react15.QRCodeStatus.Expired;
        } else {
          status2 = import_react15.QRCodeStatus.Error;
        }
        break;
      default:
        status2 = import_react15.QRCodeStatus.Error;
    }
    return [desc2, errorTitle2, errorDesc2, status2];
  }, [state, message]);
  const onRefresh = (0, import_react16.useCallback)(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react15.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react15.QRCode,
    {
      link: data || "",
      description: desc,
      errorTitle,
      errorDesc,
      onRefresh,
      status
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react15.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/WalletList.tsx
var import_react17 = require("@cosmology-ui/react");
var import_react18 = require("react");

// src/modal/constant.ts
var WC_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzg1IiBoZWlnaHQ9IjIzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxwYXRoIGQ9Ik03OC42NTAxIDQ2LjAwMDFjNjIuNjQ5OS02MS4zMSAxNjQuMjE5OS02MS4zMSAyMjYuODY5OSAwbDcuNTQgNy4zOGMuNzQzLjcyMDYgMS4zMzQgMS41ODMyIDEuNzM4IDIuNTM2Ni40MDQuOTUzNC42MTEgMS45NzgxLjYxMSAzLjAxMzQgMCAxLjAzNTMtLjIwNyAyLjA2LS42MTEgMy4wMTM0LS40MDQuOTUzNC0uOTk1IDEuODE2LTEuNzM4IDIuNTM2NmwtMjUuNzkgMjUuMjVjLS43NjEuNzM1LTEuNzc3IDEuMTQ1OC0yLjgzNSAxLjE0NThzLTIuMDc0LS40MTA4LTIuODM1LTEuMTQ1OGwtMTAuMzgtMTAuMTZjLTQzLjctNDIuNzctMTE0LjU3LTQyLjc3LTE1OC4yNyAwbC0xMS4xMSAxMC44OGMtLjc2Mi43MzU2LTEuNzggMS4xNDY4LTIuODM5OSAxLjE0NjgtMS4wNTk1IDAtMi4wNzc2LS40MTEyLTIuODQwMS0xLjE0NjhsLTI1Ljc4OTktMjUuMjVjLS43NDM0LS43MjA2LTEuMzM0NC0xLjU4MzItMS43Mzc5LTIuNTM2Ni0uNDAzNi0uOTUzNC0uNjExNi0xLjk3ODEtLjYxMTYtMy4wMTM0IDAtMS4wMzUzLjIwOC0yLjA2LjYxMTYtMy4wMTM0LjQwMzUtLjk1MzQuOTk0NS0xLjgxNiAxLjczNzktMi41MzY2bDguMjgtOC4xWm0yODAuMjA5OSA1Mi4yMSAyMyAyMi40NTk5Yy43NDIuNzIyIDEuMzMyIDEuNTg2IDEuNzM1IDIuNTRzLjYxMSAxLjk3OS42MTEgMy4wMTUtLjIwOCAyLjA2MS0uNjExIDMuMDE1Yy0uNDAzLjk1NC0uOTkzIDEuODE4LTEuNzM1IDIuNTRMMjc4LjMxIDIzMy4wNmMtMS41MiAxLjQ3Mi0zLjU1NCAyLjI5Ni01LjY3IDIuMjk2cy00LjE1LS44MjQtNS42Ny0yLjI5NmwtNzMuNDctNzEuOWMtLjE4Ni0uMTg2LS40MDYtLjMzMy0uNjQ5LS40MzQtLjI0My0uMTAxLS41MDMtLjE1Mi0uNzY2LS4xNTJzLS41MjMuMDUxLS43NjYuMTUyLS40NjMuMjQ4LS42NDkuNDM0bC03My40NiA3MS45Yy0xLjUyMiAxLjQ3My0zLjU1NyAyLjI5Ny01LjY3NSAyLjI5N3MtNC4xNTMtLjgyNC01LjY3NS0yLjI5N0wyLjM1MDA1IDEzMS43NWMtLjc0MzMxLS43MjEtMS4zMzQzLTEuNTgzLTEuNzM3ODg2LTIuNTM3LS40MDM1ODgtLjk1My0uNjExNTUzNjUtMS45NzgtLjYxMTU1MzY1LTMuMDEzcy4yMDc5NjU2NS0yLjA2LjYxMTU1MzY1LTMuMDEzYy40MDM1ODYtLjk1NC45OTQ1NzYtMS44MTYgMS43Mzc4ODYtMi41MzdMMjUuMzUwMSA5OC4xOTAxYzEuNTE3OC0xLjQ3NzEgMy41NTIxLTIuMzAzNSA1LjY3LTIuMzAzNSAyLjExNzggMCA0LjE1MjEuODI2NCA1LjY3IDIuMzAzNUwxMTAuMTYgMTcwLjA4Yy4xODYuMTg2LjQwNi4zMzQuNjQ5LjQzNC4yNDMuMTAxLjUwMy4xNTMuNzY2LjE1M3MuNTIzLS4wNTIuNzY2LS4xNTNjLjI0My0uMS40NjMtLjI0OC42NDktLjQzNGw3My40Ni03MS44ODk5YzEuNTItMS40Nzc3IDMuNTU2LTIuMzA0NCA1LjY3NS0yLjMwNDQgMi4xMiAwIDQuMTU2LjgyNjcgNS42NzUgMi4zMDQ0bDczLjQ2IDcxLjg4OTljLjE4Ni4xODguNDA3LjMzNi42NTEuNDM4LjI0NC4xMDEuNTA1LjE1NC43NjkuMTU0cy41MjUtLjA1My43NjktLjE1NGMuMjQ0LS4xMDIuNDY1LS4yNS42NTEtLjQzOGw3My40Ni03MS44ODk5YzEuNTE4LTEuNDc3MSAzLjU1Mi0yLjMwMzUgNS42Ny0yLjMwMzVzNC4xNTIuODI2NCA1LjY3IDIuMzAzNWwtLjA0LjAyWiIgZmlsbD0iIzMzOTZGRiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMzg0LjE3djIzNS4zNUgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";

// src/modal/components/views/WalletList.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var WalletListView = ({
  onClose,
  wallets,
  initialFocus
}) => {
  const defaultInitialFocus = (0, import_react18.useRef)();
  const [isLargeScreen, setIsLargeScreen] = (0, import_react18.useState)(true);
  const onWalletClicked = (0, import_react18.useCallback)(async (wallet) => {
    await wallet.connect(true);
    if (wallet.isWalletConnected) {
      onClose();
    }
  }, []);
  (0, import_react18.useEffect)(() => {
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
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_react17.SimpleModalHead,
    {
      title: "Select your wallet",
      backButton: false,
      onClose
    }
  );
  const walletsData = (0, import_react18.useMemo)(
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
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    import_react17.SimpleDisplayWalletList,
    {
      initialFocus: initialFocus || defaultInitialFocus,
      walletsData
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react17.SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Rejected.tsx
var import_react19 = require("@chakra-ui/react");
var import_react20 = require("@cosmology-ui/react");
var import_react21 = require("react");
var import_jsx_runtime8 = require("react/jsx-runtime");
var RejectedView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo }
  } = wallet;
  const onReconnect = (0, import_react21.useCallback)(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_react20.SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_react20.SimpleDisplayModalContent,
    {
      status: import_react20.LogoStatus.Error,
      logo,
      contentHeader: "Request Rejected",
      contentDesc: wallet.rejectMessageTarget || "Connection permission is denied.",
      bottomButton: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react19.Box, { px: 6, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react20.ConnectWalletButton, { buttonText: "Reconnect", onClick: onReconnect }) })
    }
  );
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react20.SimpleModalView, { modalHead, modalContent });
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

// src/modal/modal.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var DefaultModal = ({
  isOpen,
  setOpen,
  walletRepo
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(ChakraProviderWithGivenTheme, { children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    WalletModal,
    {
      isOpen,
      setOpen,
      walletRepo,
      modalViews: defaultModalViews
    }
  ) });
};
var WalletModal = ({
  isOpen,
  setOpen,
  walletRepo,
  modalViews,
  includeAllWalletsOnMobile
}) => {
  const initialFocus = (0, import_react23.useRef)();
  const [currentView, setCurrentView] = (0, import_react23.useState)(
    import_core2.ModalView.WalletList
  );
  const [qrState, setQRState] = (0, import_react23.useState)(import_core2.State.Init);
  const [qrMsg, setQRMsg] = (0, import_react23.useState)("");
  const current = walletRepo?.current;
  current?.client?.setActions?.({
    qrUrl: {
      state: setQRState,
      message: setQRMsg
    }
  });
  const walletStatus = current?.walletStatus;
  const message = current?.message;
  (0, import_react23.useEffect)(() => {
    if (isOpen) {
      switch (walletStatus) {
        case import_core2.WalletStatus.Connecting:
          if (qrState === import_core2.State.Init) {
            setCurrentView(import_core2.ModalView.Connecting);
          } else {
            setCurrentView(import_core2.ModalView.QRCode);
          }
          break;
        case import_core2.WalletStatus.Connected:
          setCurrentView(import_core2.ModalView.Connected);
          break;
        case import_core2.WalletStatus.Error:
          if (qrState === import_core2.State.Init) {
            setCurrentView(import_core2.ModalView.Error);
          } else {
            setCurrentView(import_core2.ModalView.QRCode);
          }
          break;
        case import_core2.WalletStatus.Rejected:
          setCurrentView(import_core2.ModalView.Rejected);
          break;
        case import_core2.WalletStatus.NotExist:
          setCurrentView(import_core2.ModalView.NotExist);
          break;
        case import_core2.WalletStatus.Disconnected:
          setCurrentView(import_core2.ModalView.WalletList);
          break;
        default:
          setCurrentView(import_core2.ModalView.WalletList);
          break;
      }
    }
  }, [isOpen, qrState, walletStatus, qrMsg, message]);
  const onCloseModal = (0, import_react23.useCallback)(() => {
    setOpen(false);
    if (walletStatus === "Connecting") {
      current?.disconnect();
    }
  }, [setOpen, walletStatus, current]);
  const onReturn = (0, import_react23.useCallback)(() => {
    setCurrentView(import_core2.ModalView.WalletList);
  }, [setCurrentView]);
  const modalView = (0, import_react23.useMemo)(() => {
    let ViewComponent;
    switch (currentView) {
      case import_core2.ModalView.WalletList:
        ViewComponent = modalViews[`${currentView}`];
        const wallets = walletRepo?.isMobile && !includeAllWalletsOnMobile ? walletRepo?.wallets.filter((w) => !w.walletInfo.mobileDisabled) : walletRepo?.wallets;
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          ViewComponent,
          {
            onClose: onCloseModal,
            wallets: wallets || [],
            initialFocus
          }
        );
      default:
        if (!current)
          return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", {});
        ViewComponent = modalViews[`${currentView}`];
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          ViewComponent,
          {
            onClose: onCloseModal,
            onReturn,
            wallet: current
          }
        );
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    import_react22.SimpleConnectModal,
    {
      modalOpen: isOpen,
      modalOnClose: onCloseModal,
      modalView,
      initialRef: initialFocus
    }
  );
};

// src/provider.tsx
var import_core3 = require("@cosmos-kit/core");
var import_react_lite = require("@cosmos-kit/react-lite");
var import_react24 = require("react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var ChainProvider = ({
  chains,
  assetLists,
  wallets,
  walletModal,
  modalTheme,
  modalViews,
  includeAllWalletsOnMobile = false,
  wrappedWithChakra = false,
  throwErrors = false,
  defaultNameService = "icns",
  walletConnectOptions,
  signerOptions,
  endpointOptions,
  sessionOptions,
  logLevel = "WARN",
  children
}) => {
  const logger = (0, import_react24.useMemo)(() => new import_core3.Logger(logLevel), []);
  if (wrappedWithChakra && modalTheme) {
    logger.warn(
      "Your are suggesting there already been a Chakra Theme active in higher level (with `wrappedWithChakra` is true). `modalTheme` will not work in this case."
    );
  }
  const getChainProvider = (modal) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    import_react_lite.ChainProvider,
    {
      chains,
      assetLists,
      wallets,
      walletModal: modal,
      throwErrors,
      defaultNameService,
      walletConnectOptions,
      signerOptions,
      endpointOptions,
      sessionOptions,
      logLevel,
      children
    }
  );
  if (walletModal) {
    logger.debug("Using provided wallet modal.");
    return getChainProvider(walletModal);
  }
  logger.debug("Using default wallet modal.");
  const defaultModal = (0, import_react24.useCallback)(
    (props) => /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      WalletModal,
      {
        ...props,
        modalViews: {
          ...defaultModalViews,
          ...modalViews
        },
        includeAllWalletsOnMobile
      }
    ),
    [defaultModalViews]
  );
  if (wrappedWithChakra) {
    logger.debug("Wrap with <ChakraProviderWithOuterTheme>.");
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ChakraProviderWithOuterTheme, { logger, children: getChainProvider(defaultModal) });
  } else {
    logger.debug("Wrap with <ChakraProviderWithGivenTheme>.");
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(ChakraProviderWithGivenTheme, { theme: modalTheme, logger, children: getChainProvider(defaultModal) });
  }
};

// src/hooks/useModalTheme.ts
var import_react25 = require("@cosmology-ui/react");
var import_react26 = __toESM(require("react"));
var useModalTheme = () => {
  const context = import_react26.default.useContext(import_react25.ThemeContext);
  if (!context) {
    throw new Error("You have forgot to use ThemeProvider.");
  }
  return {
    modalTheme: context.theme.toString(),
    setModalTheme: (theme) => {
      switch (theme) {
        case "dark":
          context.setTheme(import_react25.Themes.Dark);
          break;
        case "light":
          context.setTheme(import_react25.Themes.Light);
          break;
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainProvider,
  DefaultModal,
  WalletModal,
  addSemanticTokens,
  defaultTheme,
  noCssResetTheme,
  useChain,
  useChainWallet,
  useManager,
  useModalTheme,
  useNameService,
  useWallet,
  useWalletClient,
  walletContext
});
//# sourceMappingURL=index.js.map
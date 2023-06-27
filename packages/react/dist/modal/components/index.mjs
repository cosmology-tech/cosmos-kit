// src/modal/components/theme-wrapper.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "@cosmology-ui/react";
import { ThemeContext } from "@emotion/react";
import { useContext, useMemo } from "react";

// src/modal/theme.ts
import { extendTheme } from "@chakra-ui/react";
import { semanticTokens } from "@cosmology-ui/react";
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
    ...semanticTokens.semanticTokens.colors,
    ...theme?.semanticTokens?.colors
  };
  const shadows = {
    ...semanticTokens.semanticTokens.shadows,
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
    ...extendTheme(themeWithReset),
    ...theme,
    ...mergedSemanticTokens
  };
}
var defaultTheme = addSemanticTokens(extendTheme(themeWithReset));
var noCssResetTheme = addSemanticTokens(
  extendTheme(themeWithoutReset)
);

// src/modal/components/theme-wrapper.tsx
import { jsx } from "react/jsx-runtime";
function ChakraProviderWithOuterTheme({
  logger,
  children
}) {
  const outerTheme = useContext(ThemeContext);
  const theme = useMemo(() => addSemanticTokens(outerTheme), [outerTheme]);
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(ChakraProvider, { theme, resetCSS: true, children }) });
}
function ChakraProviderWithGivenTheme({
  theme,
  logger,
  children
}) {
  const _theme = useMemo(() => {
    if (theme) {
      return addSemanticTokens(theme);
    } else {
      return noCssResetTheme;
    }
  }, [theme]);
  return /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsx(ChakraProvider, { theme: _theme, resetCSS: false, children }) });
}

// src/modal/components/views/Connected.tsx
import { Box, Icon } from "@chakra-ui/react";
import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  SimpleDisplayModalContent,
  SimpleModalHead,
  SimpleModalView
} from "@cosmology-ui/react";
import { useCallback } from "react";
import { RiDoorOpenFill } from "react-icons/ri";
import { jsx as jsx2 } from "react/jsx-runtime";
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
  const onDisconnect = useCallback(() => wallet.disconnect(true), [wallet]);
  const modalHead = /* @__PURE__ */ jsx2(
    SimpleModalHead,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx2(
    SimpleDisplayModalContent,
    {
      logo: Astronaut,
      username,
      walletIcon: logo,
      addressButton: /* @__PURE__ */ jsx2(CopyAddressButton, { address }),
      bottomButton: /* @__PURE__ */ jsx2(Box, { px: 6, children: /* @__PURE__ */ jsx2(
        ConnectWalletButton,
        {
          leftIcon: /* @__PURE__ */ jsx2(Icon, { as: RiDoorOpenFill }),
          buttonText: "Disconnect",
          onClick: onDisconnect
        }
      ) })
    }
  );
  return /* @__PURE__ */ jsx2(SimpleModalView, { modalHead, modalContent });
};

// src/modal/components/views/Connecting.tsx
import {
  LogoStatus,
  SimpleDisplayModalContent as SimpleDisplayModalContent2,
  SimpleModalHead as SimpleModalHead2,
  SimpleModalView as SimpleModalView2
} from "@cosmology-ui/react";
import { jsx as jsx3 } from "react/jsx-runtime";
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
  const modalHead = /* @__PURE__ */ jsx3(
    SimpleModalHead2,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx3(
    SimpleDisplayModalContent2,
    {
      status: LogoStatus.Loading,
      logo,
      contentHeader: title,
      contentDesc: desc
    }
  );
  return /* @__PURE__ */ jsx3(SimpleModalView2, { modalHead, modalContent });
};

// src/modal/components/views/Error.tsx
import { Box as Box2 } from "@chakra-ui/react";
import {
  ConnectWalletButton as ConnectWalletButton2,
  LogoStatus as LogoStatus2,
  SimpleDisplayModalContent as SimpleDisplayModalContent3,
  SimpleModalHead as SimpleModalHead3,
  SimpleModalView as SimpleModalView3
} from "@cosmology-ui/react";
import { jsx as jsx4 } from "react/jsx-runtime";
var ErrorView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName, logo },
    message
  } = wallet;
  const modalHead = /* @__PURE__ */ jsx4(
    SimpleModalHead3,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx4(
    SimpleDisplayModalContent3,
    {
      status: LogoStatus2.Error,
      logo,
      contentHeader: "Oops! Something wrong...",
      contentDesc: message,
      bottomButton: /* @__PURE__ */ jsx4(Box2, { px: 6, children: /* @__PURE__ */ jsx4(
        ConnectWalletButton2,
        {
          buttonText: "Change Wallet",
          onClick: onReturn
        }
      ) })
    }
  );
  return /* @__PURE__ */ jsx4(SimpleModalView3, { modalHead, modalContent });
};

// src/modal/components/views/NotExist.tsx
import {
  InstallWalletButton,
  LogoStatus as LogoStatus3,
  SimpleDisplayModalContent as SimpleDisplayModalContent4,
  SimpleModalHead as SimpleModalHead4,
  SimpleModalView as SimpleModalView4
} from "@cosmology-ui/react";
import { useCallback as useCallback2, useMemo as useMemo2 } from "react";
import { GoDesktopDownload } from "react-icons/go";
import { RiChromeFill } from "react-icons/ri";
import { FaAndroid } from "react-icons/fa";
import { RiAppStoreFill } from "react-icons/ri";
import { GrFirefox } from "react-icons/gr";
import { jsx as jsx5 } from "react/jsx-runtime";
var NotExistView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo },
    downloadInfo
  } = wallet;
  const onInstall = useCallback2(() => {
    window.open(downloadInfo?.link, "_blank");
  }, [downloadInfo]);
  const icon = useMemo2(() => {
    if (downloadInfo?.browser === "chrome")
      return RiChromeFill;
    if (downloadInfo?.browser === "firefox")
      return GrFirefox;
    if (downloadInfo?.os === "android")
      return FaAndroid;
    if (downloadInfo?.os === "ios")
      return RiAppStoreFill;
    return GoDesktopDownload;
  }, [downloadInfo]);
  const modalHead = /* @__PURE__ */ jsx5(
    SimpleModalHead4,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx5(
    SimpleDisplayModalContent4,
    {
      status: LogoStatus3.Error,
      logo,
      contentHeader: `${prettyName} Not Installed`,
      contentDesc: onInstall ? `If ${prettyName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instruction.` : `Download link not provided. Try searching it or consulting the developer team.`,
      bottomButton: /* @__PURE__ */ jsx5(
        InstallWalletButton,
        {
          icon,
          buttonText: `Install ${prettyName}`,
          onClick: onInstall,
          disabled: !downloadInfo?.link
        }
      )
    }
  );
  return /* @__PURE__ */ jsx5(SimpleModalView4, { modalHead, modalContent });
};

// src/modal/components/views/QRCode.tsx
import {
  SimpleModalHead as SimpleModalHead5,
  QRCode as SimpleQRCode,
  SimpleModalView as SimpleModalView5,
  QRCodeStatus
} from "@cosmology-ui/react";
import { ExpiredError, State } from "@cosmos-kit/core";
import { useCallback as useCallback3, useMemo as useMemo3 } from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var QRCodeView = ({ onClose, onReturn, wallet }) => {
  const {
    walletInfo: { prettyName },
    qrUrl: { data, state, message }
  } = wallet;
  const [desc, errorTitle, errorDesc, status] = useMemo3(() => {
    let desc2 = `Open ${prettyName} App to Scan`;
    let errorTitle2, errorDesc2;
    if (state === "Error") {
      desc2 = void 0;
      if (message === ExpiredError.message) {
        errorTitle2 = "QRCode Expired";
        errorDesc2 = "Click to refresh.";
      } else {
        errorTitle2 = "QRCode Error";
        errorDesc2 = message;
      }
    }
    let status2;
    switch (state) {
      case State.Pending:
        status2 = QRCodeStatus.Pending;
        break;
      case State.Done:
        status2 = QRCodeStatus.Done;
        break;
      case State.Error:
        if (message === ExpiredError.message) {
          status2 = QRCodeStatus.Expired;
        } else {
          status2 = QRCodeStatus.Error;
        }
        break;
      default:
        status2 = QRCodeStatus.Error;
    }
    return [desc2, errorTitle2, errorDesc2, status2];
  }, [state, message]);
  const onRefresh = useCallback3(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ jsx6(
    SimpleModalHead5,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx6(
    SimpleQRCode,
    {
      link: data || "",
      description: desc,
      errorTitle,
      errorDesc,
      onRefresh,
      status
    }
  );
  return /* @__PURE__ */ jsx6(SimpleModalView5, { modalHead, modalContent });
};

// src/modal/components/views/WalletList.tsx
import {
  SimpleDisplayWalletList,
  SimpleModalHead as SimpleModalHead6,
  SimpleModalView as SimpleModalView6
} from "@cosmology-ui/react";
import {
  useCallback as useCallback4,
  useEffect,
  useMemo as useMemo4,
  useRef,
  useState
} from "react";

// src/modal/constant.ts
var WC_ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzg1IiBoZWlnaHQ9IjIzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxwYXRoIGQ9Ik03OC42NTAxIDQ2LjAwMDFjNjIuNjQ5OS02MS4zMSAxNjQuMjE5OS02MS4zMSAyMjYuODY5OSAwbDcuNTQgNy4zOGMuNzQzLjcyMDYgMS4zMzQgMS41ODMyIDEuNzM4IDIuNTM2Ni40MDQuOTUzNC42MTEgMS45NzgxLjYxMSAzLjAxMzQgMCAxLjAzNTMtLjIwNyAyLjA2LS42MTEgMy4wMTM0LS40MDQuOTUzNC0uOTk1IDEuODE2LTEuNzM4IDIuNTM2NmwtMjUuNzkgMjUuMjVjLS43NjEuNzM1LTEuNzc3IDEuMTQ1OC0yLjgzNSAxLjE0NThzLTIuMDc0LS40MTA4LTIuODM1LTEuMTQ1OGwtMTAuMzgtMTAuMTZjLTQzLjctNDIuNzctMTE0LjU3LTQyLjc3LTE1OC4yNyAwbC0xMS4xMSAxMC44OGMtLjc2Mi43MzU2LTEuNzggMS4xNDY4LTIuODM5OSAxLjE0NjgtMS4wNTk1IDAtMi4wNzc2LS40MTEyLTIuODQwMS0xLjE0NjhsLTI1Ljc4OTktMjUuMjVjLS43NDM0LS43MjA2LTEuMzM0NC0xLjU4MzItMS43Mzc5LTIuNTM2Ni0uNDAzNi0uOTUzNC0uNjExNi0xLjk3ODEtLjYxMTYtMy4wMTM0IDAtMS4wMzUzLjIwOC0yLjA2LjYxMTYtMy4wMTM0LjQwMzUtLjk1MzQuOTk0NS0xLjgxNiAxLjczNzktMi41MzY2bDguMjgtOC4xWm0yODAuMjA5OSA1Mi4yMSAyMyAyMi40NTk5Yy43NDIuNzIyIDEuMzMyIDEuNTg2IDEuNzM1IDIuNTRzLjYxMSAxLjk3OS42MTEgMy4wMTUtLjIwOCAyLjA2MS0uNjExIDMuMDE1Yy0uNDAzLjk1NC0uOTkzIDEuODE4LTEuNzM1IDIuNTRMMjc4LjMxIDIzMy4wNmMtMS41MiAxLjQ3Mi0zLjU1NCAyLjI5Ni01LjY3IDIuMjk2cy00LjE1LS44MjQtNS42Ny0yLjI5NmwtNzMuNDctNzEuOWMtLjE4Ni0uMTg2LS40MDYtLjMzMy0uNjQ5LS40MzQtLjI0My0uMTAxLS41MDMtLjE1Mi0uNzY2LS4xNTJzLS41MjMuMDUxLS43NjYuMTUyLS40NjMuMjQ4LS42NDkuNDM0bC03My40NiA3MS45Yy0xLjUyMiAxLjQ3My0zLjU1NyAyLjI5Ny01LjY3NSAyLjI5N3MtNC4xNTMtLjgyNC01LjY3NS0yLjI5N0wyLjM1MDA1IDEzMS43NWMtLjc0MzMxLS43MjEtMS4zMzQzLTEuNTgzLTEuNzM3ODg2LTIuNTM3LS40MDM1ODgtLjk1My0uNjExNTUzNjUtMS45NzgtLjYxMTU1MzY1LTMuMDEzcy4yMDc5NjU2NS0yLjA2LjYxMTU1MzY1LTMuMDEzYy40MDM1ODYtLjk1NC45OTQ1NzYtMS44MTYgMS43Mzc4ODYtMi41MzdMMjUuMzUwMSA5OC4xOTAxYzEuNTE3OC0xLjQ3NzEgMy41NTIxLTIuMzAzNSA1LjY3LTIuMzAzNSAyLjExNzggMCA0LjE1MjEuODI2NCA1LjY3IDIuMzAzNUwxMTAuMTYgMTcwLjA4Yy4xODYuMTg2LjQwNi4zMzQuNjQ5LjQzNC4yNDMuMTAxLjUwMy4xNTMuNzY2LjE1M3MuNTIzLS4wNTIuNzY2LS4xNTNjLjI0My0uMS40NjMtLjI0OC42NDktLjQzNGw3My40Ni03MS44ODk5YzEuNTItMS40Nzc3IDMuNTU2LTIuMzA0NCA1LjY3NS0yLjMwNDQgMi4xMiAwIDQuMTU2LjgyNjcgNS42NzUgMi4zMDQ0bDczLjQ2IDcxLjg4OTljLjE4Ni4xODguNDA3LjMzNi42NTEuNDM4LjI0NC4xMDEuNTA1LjE1NC43NjkuMTU0cy41MjUtLjA1My43NjktLjE1NGMuMjQ0LS4xMDIuNDY1LS4yNS42NTEtLjQzOGw3My40Ni03MS44ODk5YzEuNTE4LTEuNDc3MSAzLjU1Mi0yLjMwMzUgNS42Ny0yLjMwMzVzNC4xNTIuODI2NCA1LjY3IDIuMzAzNWwtLjA0LjAyWiIgZmlsbD0iIzMzOTZGRiIvPjwvZz48ZGVmcz48Y2xpcFBhdGggaWQ9ImEiPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMzg0LjE3djIzNS4zNUgweiIvPjwvY2xpcFBhdGg+PC9kZWZzPjwvc3ZnPg==";

// src/modal/components/views/WalletList.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var WalletListView = ({
  onClose,
  wallets,
  initialFocus
}) => {
  const defaultInitialFocus = useRef();
  const [isLargeScreen, setIsLargeScreen] = useState(true);
  const onWalletClicked = useCallback4(async (wallet) => {
    await wallet.connect(true);
    if (wallet.isWalletConnected) {
      onClose();
    }
  }, []);
  useEffect(() => {
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
  const modalHead = /* @__PURE__ */ jsx7(
    SimpleModalHead6,
    {
      title: "Select your wallet",
      backButton: false,
      onClose
    }
  );
  const walletsData = useMemo4(
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
  const modalContent = /* @__PURE__ */ jsx7(
    SimpleDisplayWalletList,
    {
      initialFocus: initialFocus || defaultInitialFocus,
      walletsData
    }
  );
  return /* @__PURE__ */ jsx7(SimpleModalView6, { modalHead, modalContent });
};

// src/modal/components/views/Rejected.tsx
import { Box as Box3 } from "@chakra-ui/react";
import {
  ConnectWalletButton as ConnectWalletButton3,
  LogoStatus as LogoStatus4,
  SimpleDisplayModalContent as SimpleDisplayModalContent5,
  SimpleModalHead as SimpleModalHead7,
  SimpleModalView as SimpleModalView7
} from "@cosmology-ui/react";
import { useCallback as useCallback5 } from "react";
import { jsx as jsx8 } from "react/jsx-runtime";
var RejectedView = ({
  onClose,
  onReturn,
  wallet
}) => {
  const {
    walletInfo: { prettyName, logo }
  } = wallet;
  const onReconnect = useCallback5(() => {
    wallet.connect(false);
  }, [wallet]);
  const modalHead = /* @__PURE__ */ jsx8(
    SimpleModalHead7,
    {
      title: prettyName,
      backButton: true,
      onClose,
      onBack: onReturn
    }
  );
  const modalContent = /* @__PURE__ */ jsx8(
    SimpleDisplayModalContent5,
    {
      status: LogoStatus4.Error,
      logo,
      contentHeader: "Request Rejected",
      contentDesc: wallet.rejectMessageTarget || "Connection permission is denied.",
      bottomButton: /* @__PURE__ */ jsx8(Box3, { px: 6, children: /* @__PURE__ */ jsx8(ConnectWalletButton3, { buttonText: "Reconnect", onClick: onReconnect }) })
    }
  );
  return /* @__PURE__ */ jsx8(SimpleModalView7, { modalHead, modalContent });
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
export {
  ChakraProviderWithGivenTheme,
  ChakraProviderWithOuterTheme,
  ConnectedView,
  ConnectingView,
  ErrorView,
  NotExistView,
  QRCodeView,
  RejectedView,
  WalletListView,
  defaultModalViews
};
//# sourceMappingURL=index.mjs.map
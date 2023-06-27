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

// src/hooks/useWallet.ts
var useWallet_exports = {};
__export(useWallet_exports, {
  useWallet: () => useWallet
});
module.exports = __toCommonJS(useWallet_exports);
var import_core2 = require("@cosmos-kit/core");
var import_react2 = __toESM(require("react"));

// src/provider.tsx
var import_core = require("@cosmos-kit/core");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var walletContext = (0, import_react.createContext)(null);

// src/hooks/useWallet.ts
var useWallet = (walletName, activeOnly = true) => {
  const context = import_react2.default.useContext(walletContext);
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
      status: import_core2.WalletStatus.Disconnected,
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useWallet
});
//# sourceMappingURL=useWallet.js.map
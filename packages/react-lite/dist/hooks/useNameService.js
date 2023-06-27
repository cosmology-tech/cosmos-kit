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

// src/hooks/useNameService.ts
var useNameService_exports = {};
__export(useNameService_exports, {
  useNameService: () => useNameService
});
module.exports = __toCommonJS(useNameService_exports);
var import_core2 = require("@cosmos-kit/core");
var import_react3 = require("react");

// src/hooks/useManager.ts
var import_react2 = __toESM(require("react"));

// src/provider.tsx
var import_core = require("@cosmos-kit/core");
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var walletContext = (0, import_react.createContext)(null);

// src/hooks/useManager.ts
var useManager = () => {
  const context = import_react2.default.useContext(walletContext);
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
var useNameService = (name) => {
  const [state, setState] = (0, import_react3.useState)(import_core2.State.Pending);
  const [ns, setNS] = (0, import_react3.useState)();
  const [msg, setMsg] = (0, import_react3.useState)();
  const { defaultNameService, getNameService } = useManager();
  const registry = (0, import_react3.useMemo)(
    () => (0, import_core2.getNameServiceRegistryFromName)(name || defaultNameService),
    [name]
  );
  if (!registry) {
    throw new Error("No such name service: " + (name || defaultNameService));
  }
  (0, import_react3.useEffect)(() => {
    getNameService().then((ns2) => {
      setNS(ns2);
      setState(import_core2.State.Done);
    }).catch((e) => {
      setMsg(e.message);
      setState(import_core2.State.Error);
    }).finally(() => {
      if (state === "Pending") {
        setState(import_core2.State.Init);
      }
    });
  }, [name]);
  return {
    state,
    data: ns,
    message: msg
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useNameService
});
//# sourceMappingURL=useNameService.js.map
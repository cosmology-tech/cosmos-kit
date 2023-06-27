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

// src/utils/name-service.ts
var name_service_exports = {};
__export(name_service_exports, {
  getChainNameFromNameServiceName: () => getChainNameFromNameServiceName,
  getNameServiceNameFromChainName: () => getNameServiceNameFromChainName,
  getNameServiceRegistryFromChainName: () => getNameServiceRegistryFromChainName,
  getNameServiceRegistryFromName: () => getNameServiceRegistryFromName
});
module.exports = __toCommonJS(name_service_exports);

// src/config.ts
var nameServiceRegistries = [
  {
    name: "icns",
    contract: "osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd",
    chainName: "osmosis",
    getQueryMsg: (address) => {
      return {
        icns_names: { address }
      };
    },
    slip173: "osmo"
  },
  {
    name: "stargaze",
    contract: "stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr",
    chainName: "stargaze",
    getQueryMsg: (address) => {
      return {
        name: { address }
      };
    },
    slip173: "stars"
  }
];

// src/utils/name-service.ts
var getNameServiceRegistryFromChainName = (chainName) => {
  const registry = nameServiceRegistries.find((r) => r.chainName === chainName);
  if (!registry) {
    throw new Error("No such name service registered with chain " + chainName);
  }
  return registry;
};
var getNameServiceRegistryFromName = (name) => {
  return nameServiceRegistries.find((r) => r.name === name);
};
var getNameServiceNameFromChainName = (chainName) => {
  return nameServiceRegistries.find((r) => r.chainName === chainName)?.name;
};
var getChainNameFromNameServiceName = (name) => {
  return nameServiceRegistries.find((r) => r.name === name)?.chainName;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getChainNameFromNameServiceName,
  getNameServiceNameFromChainName,
  getNameServiceRegistryFromChainName,
  getNameServiceRegistryFromName
});
//# sourceMappingURL=name-service.js.map
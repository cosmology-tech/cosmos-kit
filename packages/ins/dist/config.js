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

// src/config.ts
var config_exports = {};
__export(config_exports, {
  nameServiceRegistries: () => nameServiceRegistries
});
module.exports = __toCommonJS(config_exports);
var nameServiceRegistries = [
  {
    name: "icns",
    contract: "osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd",
    chainName: "osmosis",
    getNameQueryMsg: (address) => {
      return {
        icns_names: { address }
      };
    },
    getAddressQueryMsg: (name, bech32_prefix) => {
      return {
        address: {
          name,
          bech32_prefix: bech32_prefix || "osmo"
        }
      };
    },
    normalizeAddressResponse: (response) => {
      return response.address;
    },
    normalizeNameResponse: (response) => {
      return response.primary_name;
    },
    slip173: "osmo"
  },
  {
    name: "sns",
    contract: "stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr",
    chainName: "stargaze",
    getNameQueryMsg: (address) => {
      return {
        name: { address }
      };
    },
    getAddressQueryMsg: (name, bech32_prefix) => {
      return {
        associated_address: {
          name
        }
      };
    },
    normalizeAddressResponse: (response) => {
      return response;
    },
    normalizeNameResponse: (response) => {
      return response;
    },
    slip173: "stars"
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  nameServiceRegistries
});
//# sourceMappingURL=config.js.map
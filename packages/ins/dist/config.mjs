// src/config.ts
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
export {
  nameServiceRegistries
};
//# sourceMappingURL=config.mjs.map
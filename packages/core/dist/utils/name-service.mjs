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
export {
  getChainNameFromNameServiceName,
  getNameServiceNameFromChainName,
  getNameServiceRegistryFromChainName,
  getNameServiceRegistryFromName
};
//# sourceMappingURL=name-service.mjs.map
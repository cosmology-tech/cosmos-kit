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

// src/extension/client.ts
var client_exports = {};
__export(client_exports, {
  VectisClient: () => VectisClient
});
module.exports = __toCommonJS(client_exports);
var import_keplr = require("@chain-registry/keplr");
var VectisClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async getSimpleAccount(chainId) {
    const { address, name } = await this.client.getKey(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username: name
    };
  }
  async getAccount(chainId) {
    const {
      address,
      algo,
      pubkey,
      name,
      isNanoLedger,
      isVectisAccount
    } = await this.client.getKey(chainId);
    return {
      username: name,
      address,
      algo,
      pubkey,
      isNanoLedger,
      isSmartContract: isVectisAccount
    };
  }
  async getOfflineSigner(chainId, preferredSignType) {
    switch (preferredSignType) {
      case "amino":
        return this.getOfflineSignerAmino(chainId);
      case "direct":
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
  }
  getOfflineSignerAmino(chainId) {
    return this.client.getOfflineSignerAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.client.getOfflineSignerDirect(chainId);
  }
  async addChain({ chain, name, assetList, preferredEndpoints }) {
    const chainInfo = (0, import_keplr.chainRegistryChainToKeplr)(
      chain,
      assetList ? [assetList] : []
    );
    if (preferredEndpoints?.rest?.[0]) {
      chainInfo.rest = preferredEndpoints?.rest?.[0];
    }
    if (preferredEndpoints?.rpc?.[0]) {
      chainInfo.rpc = preferredEndpoints?.rpc?.[0];
    }
    await this.client.suggestChains([chainInfo]);
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    return await this.client.signAmino(signer, signDoc);
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    return await this.client.signDirect(signer, signDoc);
  }
  async signArbitrary(chainId, signer, data) {
    return await this.client.signArbitrary(chainId, signer, data);
  }
  async sendTx(chainId, tx, mode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectisClient
});
//# sourceMappingURL=client.js.map
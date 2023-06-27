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
  CosmostationClient: () => CosmostationClient
});
module.exports = __toCommonJS(client_exports);
var import_cosmostation = require("@chain-registry/cosmostation");
var CosmostationClient = class {
  constructor(client) {
    this.eventMap = /* @__PURE__ */ new Map();
    this.client = client;
  }
  get cosmos() {
    return this.client.cosmos;
  }
  get ikeplr() {
    return this.client.providers.keplr;
  }
  async suggestToken({ chainName, tokens, type }) {
    if (type === "cw20") {
      await this.cosmos.request({
        method: "cos_addTokensCW20",
        params: {
          chainName,
          tokens
        }
      });
    }
  }
  async getSimpleAccount(chainId) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address,
      username
    };
  }
  async getAccount(chainId) {
    const key = await this.cosmos.request({
      method: "cos_requestAccount",
      params: { chainName: chainId }
    });
    return {
      username: key.name,
      address: key.address,
      pubkey: key.publicKey,
      algo: key.algo
    };
  }
  async disconnect() {
    await this.cosmos.request({
      method: "cos_disconnect"
    });
  }
  on(type, listener) {
    const event = this.cosmos.on(type, listener);
    const typeEventMap = this.eventMap.get(type) || /* @__PURE__ */ new Map();
    typeEventMap.set(listener, event);
    this.eventMap.set(type, typeEventMap);
  }
  off(type, listener) {
    const event = this.eventMap.get(type)?.get(listener);
    if (event) {
      this.cosmos.off(event);
    }
  }
  getOfflineSigner(chainId, preferredSignType) {
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
    return this.ikeplr.getOfflineSignerOnlyAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.ikeplr.getOfflineSigner(chainId);
  }
  async addChain(chainInfo) {
    const suggestChain = (0, import_cosmostation.chainRegistryChainToCosmostation)(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );
    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      suggestChain.restURL = chainInfo.preferredEndpoints?.rest?.[0];
    }
    const result = await this.cosmos.request({
      method: "cos_addChain",
      params: suggestChain
    });
    if (!result) {
      throw new Error(`Failed to add chain ${chainInfo.name}.`);
    }
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    try {
      return await this.ikeplr.signAmino(chainId, signer, signDoc, signOptions);
    } catch (error) {
      return await this.cosmos.request({
        method: "cos_signAmino",
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee
        }
      });
    }
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    try {
      return await this.ikeplr.signDirect(
        chainId,
        signer,
        signDoc,
        signOptions
      );
    } catch (error) {
      return await this.cosmos.request({
        method: "cos_signDirect",
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditMemo: signOptions?.preferNoSetMemo,
          isEditFee: signOptions?.preferNoSetFee
        }
      });
    }
  }
  async signArbitrary(chainId, signer, data) {
    try {
      return await this.ikeplr.signArbitrary(chainId, signer, data);
    } catch (error) {
      const message = typeof data === "string" ? data : new TextDecoder("utf-8").decode(data);
      return await this.cosmos.request({
        method: "cos_signMessage",
        params: {
          chainName: chainId,
          signer,
          message
        }
      });
    }
  }
  async sendTx(chainId, tx, mode) {
    return await this.ikeplr.sendTx(chainId, tx, mode);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CosmostationClient
});
//# sourceMappingURL=client.js.map
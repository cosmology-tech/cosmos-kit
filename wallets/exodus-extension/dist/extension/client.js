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
  ExodusClient: () => ExodusClient
});
module.exports = __toCommonJS(client_exports);
var ExodusClient = class {
  constructor(client) {
    this.client = client;
  }
  async connect(chainId) {
    await this.client.connect({
      chainId: Array.isArray(chainId) ? chainId[0] : chainId
    });
  }
  async getSimpleAccount(chainId) {
    const { address } = await this.getAccount(chainId);
    return {
      namespace: "cosmos",
      chainId,
      address
    };
  }
  async getAccount(chainId) {
    const response = await this.client.connect({ chainId });
    return {
      ...response,
      pubkey: response.publicKey
    };
  }
  async getOfflineSigner(chainId) {
    return {
      getAccounts: async () => [
        await this.getAccount(chainId)
      ],
      signDirect: async (signer, signDoc) => {
        return this.client.signTransaction(signDoc);
      }
    };
  }
  async signAmino(chainId, signer, signDoc) {
    return this.client.signAminoTransaction(signDoc);
  }
  async sendTx(chainId, transaction, mode) {
    return this.client.sendTx(chainId, transaction, mode);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExodusClient
});
//# sourceMappingURL=client.js.map
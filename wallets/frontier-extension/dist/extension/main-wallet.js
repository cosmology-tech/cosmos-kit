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

// src/extension/main-wallet.ts
var main_wallet_exports = {};
__export(main_wallet_exports, {
  FrontierExtensionWallet: () => FrontierExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainFrontierExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
var FrontierClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async disconnect() {
    await this.client.disconnect();
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
    const key = await this.client.getKey(chainId);
    console.log("%cclient.ts line:25 key", "color: #007acc;", key);
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo,
      pubkey: key.pubKey
    };
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
    return this.client.getOfflineSignerOnlyAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.client.getOfflineSigner(chainId);
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    return await this.client.signAmino(chainId, signer, signDoc, signOptions);
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  }
  async signArbitrary(chainId, signer, data) {
    return await this.client.signArbitrary(chainId, signer, data);
  }
  async sendTx(chainId, tx, mode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
};

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getFrontierFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const frontier = window.frontier?.cosmos;
  if (frontier) {
    return frontier;
  }
  if (document.readyState === "complete") {
    if (frontier) {
      return frontier;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (frontier) {
          resolve(frontier);
        } else {
          reject(import_core2.ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};

// src/extension/main-wallet.ts
var FrontierExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainFrontierExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const frontier = await getFrontierFromExtension();
      this.initClientDone(frontier ? new FrontierClient(frontier) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FrontierExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map
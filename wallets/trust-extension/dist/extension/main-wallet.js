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
  TrustExtensionWallet: () => TrustExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainTrustExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
var TrustClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
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
    return {
      username: key.name,
      address: key.bech32Address,
      algo: key.algo,
      pubkey: key.pubKey
    };
  }
  getOfflineSigner(chainId, preferredSignType) {
    return this.client.getOfflineSigner(chainId);
  }
};

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getTrustFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const trust = window.trustwallet?.cosmos;
  if (trust) {
    return trust;
  }
  if (document.readyState === "complete") {
    if (trust) {
      return trust;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (trust) {
          resolve(trust);
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
var TrustExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainTrustExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const trust = await getTrustFromExtension();
      this.initClientDone(trust ? new TrustClient(trust) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrustExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map
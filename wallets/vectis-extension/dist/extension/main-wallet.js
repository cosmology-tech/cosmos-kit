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
  VectisExtensionWallet: () => VectisExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainVectisExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
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

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getVectisFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const vectis = window.vectis?.cosmos;
  if (vectis) {
    return vectis;
  }
  if (document.readyState === "complete") {
    if (vectis) {
      return vectis;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (vectis) {
          resolve(vectis);
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
var VectisExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainVectisExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const vectis = await getVectisFromExtension();
      this.initClientDone(vectis ? new VectisClient(vectis) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VectisExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map
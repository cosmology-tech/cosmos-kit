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
  CompassExtensionWallet: () => CompassExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainCompassExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
var import_keplr = require("@chain-registry/keplr");
var CompassClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async suggestToken({ chainId, tokens, type }) {
    if (type === "cw20") {
      for (const { contractAddress } of tokens) {
        await this.client.suggestToken(chainId, contractAddress);
      }
    }
  }
  async addChain(chainInfo) {
    const suggestChain = (0, import_keplr.chainRegistryChainToKeplr)(
      chainInfo.chain,
      chainInfo.assetList ? [chainInfo.assetList] : []
    );
    if (chainInfo.preferredEndpoints?.rest?.[0]) {
      suggestChain.rest = chainInfo.preferredEndpoints?.rest?.[0];
    }
    if (chainInfo.preferredEndpoints?.rpc?.[0]) {
      suggestChain.rpc = chainInfo.preferredEndpoints?.rpc?.[0];
    }
    await this.client.experimentalSuggestChain(suggestChain);
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
  async signArbitrary(chainId, signer, data) {
    return await this.client.signArbitrary(chainId, signer, data);
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    return await this.client.signDirect(chainId, signer, signDoc, signOptions);
  }
  async sendTx(chainId, tx, mode) {
    return await this.client.sendTx(chainId, tx, mode);
  }
};

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getCompassFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const compass = window.compass;
  if (compass) {
    return compass;
  }
  if (document.readyState === "complete") {
    if (compass) {
      return compass;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (compass) {
          resolve(compass);
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
var CompassExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo) {
    super(walletInfo, ChainCompassExtension);
  }
  async initClient() {
    this.initingClient();
    try {
      const compass = await getCompassFromExtension();
      this.initClientDone(compass ? new CompassClient(compass) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CompassExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map
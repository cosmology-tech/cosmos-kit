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
  ExodusExtensionWallet: () => ExodusExtensionWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core3 = require("@cosmos-kit/core");

// src/extension/chain-wallet.ts
var import_core = require("@cosmos-kit/core");
var ChainExodusExtension = class extends import_core.ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
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

// src/extension/utils.ts
var import_core2 = require("@cosmos-kit/core");
var getExodusFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const exodus = window.exodus;
  if (exodus) {
    return exodus;
  }
  if (document.readyState === "complete") {
    if (exodus) {
      return exodus;
    } else {
      throw import_core2.ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (exodus) {
          resolve(exodus);
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
var ExodusExtensionWallet = class extends import_core3.MainWalletBase {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainExodusExtension);
    this.preferredEndpoints = preferredEndpoints;
  }
  async initClient() {
    this.initingClient();
    try {
      const exodus = await getExodusFromExtension();
      if (!exodus?.cosmos) {
        throw new Error("Exodus client does not support Cosmos provider");
      }
      this.initClientDone(exodus ? new ExodusClient(exodus.cosmos) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ExodusExtensionWallet
});
//# sourceMappingURL=main-wallet.js.map
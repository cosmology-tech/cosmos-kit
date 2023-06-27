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

// src/main-wallet.ts
var main_wallet_exports = {};
__export(main_wallet_exports, {
  WCWallet: () => WCWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_core = require("@cosmos-kit/core");
var import_core2 = require("@cosmos-kit/core");
var WCWallet = class extends import_core2.MainWalletBase {
  constructor(walletInfo, ChainWC, WCClient) {
    if (!walletInfo.walletconnect) {
      throw new Error(
        `'walletconnect' info for wallet ${walletInfo.prettyName} is not provided in wallet registry.`
      );
    }
    super(walletInfo, ChainWC);
    this.clientMutable = { state: import_core.State.Init };
    this.WCClient = WCClient;
  }
  async initClient(options) {
    if (!options) {
      this.initClientError(
        new Error("`walletconnectOptions` is not provided.")
      );
      return;
    }
    if (!options.signClient.projectId) {
      this.initClientError(
        new Error("`projectId` is not provided in `walletconnectOptions`.")
      );
      return;
    }
    this.initingClient();
    try {
      const client = new this.WCClient(this.walletInfo);
      client.logger = this.logger;
      client.emitter = this.emitter;
      client.env = this.env;
      client.options = options;
      await client.init();
      this.initClientDone(client);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WCWallet
});
//# sourceMappingURL=main-wallet.js.map
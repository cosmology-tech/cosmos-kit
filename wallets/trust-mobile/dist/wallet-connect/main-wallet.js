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

// src/wallet-connect/main-wallet.ts
var main_wallet_exports = {};
__export(main_wallet_exports, {
  TrustMobileWallet: () => TrustMobileWallet
});
module.exports = __toCommonJS(main_wallet_exports);
var import_walletconnect3 = require("@cosmos-kit/walletconnect");

// src/wallet-connect/chain-wallet.ts
var import_walletconnect2 = require("@cosmos-kit/walletconnect");

// src/wallet-connect/client.ts
var import_walletconnect = require("@cosmos-kit/walletconnect");
var TrustClient = class extends import_walletconnect.WCClient {
  constructor(walletInfo) {
    super(walletInfo);
    this.getOfflineSignerAmino = void 0;
  }
  async signAmino(chainId, signer, signDoc, signOptions) {
    throw new Error("Trust doesn't support `signAmino` method.");
  }
  async signDirect(chainId, signer, signDoc, signOptions) {
    const result = await this._signDirect(
      chainId,
      signer,
      signDoc,
      signOptions
    );
    return {
      signed: signDoc,
      signature: result
    };
  }
};

// src/wallet-connect/chain-wallet.ts
var ChainTrustMobile = class extends import_walletconnect2.ChainWC {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo, TrustClient);
  }
};

// src/wallet-connect/main-wallet.ts
var TrustMobileWallet = class extends import_walletconnect3.WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainTrustMobile, TrustClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TrustMobileWallet
});
//# sourceMappingURL=main-wallet.js.map
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

// src/wallet-connect/chain-wallet.ts
var chain_wallet_exports = {};
__export(chain_wallet_exports, {
  ChainTrustMobile: () => ChainTrustMobile
});
module.exports = __toCommonJS(chain_wallet_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChainTrustMobile
});
//# sourceMappingURL=chain-wallet.js.map
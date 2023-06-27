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

// src/trust.ts
var trust_exports = {};
__export(trust_exports, {
  wallets: () => wallets
});
module.exports = __toCommonJS(trust_exports);

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
var import_walletconnect3 = require("@cosmos-kit/walletconnect");
var TrustMobileWallet = class extends import_walletconnect3.WCWallet {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainTrustMobile, TrustClient);
    this.preferredEndpoints = preferredEndpoints;
  }
};

// src/constant.ts
var ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjUiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NSA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0zMi4zOTk5IDY0QzUwLjA3MyA2NCA2NC4zOTk5IDQ5LjY3MzEgNjQuMzk5OSAzMkM2NC4zOTk5IDE0LjMyNjkgNTAuMDczIDAgMzIuMzk5OSAwQzE0LjcyNjggMCAwLjM5OTkwMiAxNC4zMjY5IDAuMzk5OTAyIDMyQzAuMzk5OTAyIDQ5LjY3MzEgMTQuNzI2OCA2NCAzMi4zOTk5IDY0WiIgZmlsbD0iIzMzNzVCQiIvPgo8cGF0aCBkPSJNMzIuNjI2NyAxNEMzOC45NTA4IDE5LjI4MTYgNDYuMjAyOSAxOC45NTU5IDQ4LjI3NSAxOC45NTU5QzQ3LjgyMTcgNDguOTkzNyA0NC4zNjgzIDQzLjAzNzMgMzIuNjI2NyA1MS40NkMyMC44ODUxIDQzLjAzNzMgMTcuNDUzMyA0OC45OTM3IDE3IDE4Ljk1NTlDMTkuMDUwNSAxOC45NTU5IDI2LjMwMjYgMTkuMjgxNiAzMi42MjY3IDE0WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4zOTk5MDIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

// src/wallet-connect/registry.ts
var trustMobileInfo = {
  name: "trust-mobile",
  prettyName: "Trust Mobile",
  logo: ICON,
  mode: "wallet-connect",
  mobileDisabled: false,
  rejectMessage: {
    source: "Request rejected"
  },
  downloads: [
    {
      device: "mobile",
      os: "android",
      link: "https://play.google.com/store/apps/details?id=com.chainapsis.trust&hl=en&gl=US&pli=1"
    },
    {
      device: "mobile",
      os: "ios",
      link: "https://apps.apple.com/us/app/trust-wallet/id1567851089"
    },
    {
      link: "https://www.trust.app/download"
    }
  ],
  connectEventNamesOnWindow: ["trust_keystorechange"],
  walletconnect: {
    name: "Trust Wallet",
    projectId: "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0"
  }
};

// src/trust.ts
var trustMobile = new TrustMobileWallet(trustMobileInfo);
var wallets = [trustMobile];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  wallets
});
//# sourceMappingURL=trust.js.map
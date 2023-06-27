// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainTrustExtension = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

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
import { ClientNotExistError } from "@cosmos-kit/core";
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
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (trust) {
          resolve(trust);
        } else {
          reject(ClientNotExistError.message);
        }
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };
    document.addEventListener("readystatechange", documentStateChange);
  });
};

// src/extension/main-wallet.ts
var TrustExtensionWallet = class extends MainWalletBase {
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

// src/constant.ts
var ICON = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjUiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NSA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGQ9Ik0zMi4zOTk5IDY0QzUwLjA3MyA2NCA2NC4zOTk5IDQ5LjY3MzEgNjQuMzk5OSAzMkM2NC4zOTk5IDE0LjMyNjkgNTAuMDczIDAgMzIuMzk5OSAwQzE0LjcyNjggMCAwLjM5OTkwMiAxNC4zMjY5IDAuMzk5OTAyIDMyQzAuMzk5OTAyIDQ5LjY3MzEgMTQuNzI2OCA2NCAzMi4zOTk5IDY0WiIgZmlsbD0iIzMzNzVCQiIvPgo8cGF0aCBkPSJNMzIuNjI2NyAxNEMzOC45NTA4IDE5LjI4MTYgNDYuMjAyOSAxOC45NTU5IDQ4LjI3NSAxOC45NTU5QzQ3LjgyMTcgNDguOTkzNyA0NC4zNjgzIDQzLjAzNzMgMzIuNjI2NyA1MS40NkMyMC44ODUxIDQzLjAzNzMgMTcuNDUzMyA0OC45OTM3IDE3IDE4Ljk1NTlDMTkuMDUwNSAxOC45NTU5IDI2LjMwMjYgMTkuMjgxNiAzMi42MjY3IDE0WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+CjxkZWZzPgo8Y2xpcFBhdGggaWQ9ImNsaXAwIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4zOTk5MDIpIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==";

// src/extension/registry.ts
var trustExtensionInfo = {
  name: "trust-extension",
  prettyName: "Trust",
  logo: ICON,
  mode: "extension",
  mobileDisabled: true,
  rejectMessage: {
    source: "Request rejected"
  },
  downloads: [
    {
      device: "mobile",
      os: "android",
      link: "https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&referrer=utm_source%3Dwebsite"
    },
    {
      device: "mobile",
      os: "ios",
      link: "https://apps.apple.com/app/apple-store/id1288339409?mt=8"
    }
  ]
};

// src/trust.ts
var trustExtension = new TrustExtensionWallet(trustExtensionInfo);
var wallets = [trustExtension];
export {
  ChainTrustExtension,
  TrustExtensionWallet,
  trustExtensionInfo,
  wallets
};
//# sourceMappingURL=index.mjs.map
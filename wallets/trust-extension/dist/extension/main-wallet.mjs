// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainTrustExtension = class extends ChainWalletBase {
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
export {
  TrustExtensionWallet
};
//# sourceMappingURL=main-wallet.mjs.map
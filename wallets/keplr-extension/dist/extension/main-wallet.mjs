// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainKeplrExtension = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
var KeplrClient = class {
  constructor(client) {
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async suggestToken({ chainId, tokens, type }) {
    if (type === "cw20") {
      for (const { contractAddress, viewingKey } of tokens) {
        await this.client.suggestToken(chainId, contractAddress, viewingKey);
      }
    }
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
  async addChain(chainInfo) {
    const suggestChain = chainRegistryChainToKeplr(
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
import { ClientNotExistError } from "@cosmos-kit/core";
var getKeplrFromExtension = async () => {
  if (typeof window === "undefined") {
    return void 0;
  }
  const keplr = window.keplr;
  if (keplr) {
    return keplr;
  }
  if (document.readyState === "complete") {
    if (keplr) {
      return keplr;
    } else {
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (keplr) {
          resolve(keplr);
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
var KeplrExtensionWallet = class extends MainWalletBase {
  constructor(walletInfo, preferredEndpoints) {
    super(walletInfo, ChainKeplrExtension);
    this.preferredEndpoints = preferredEndpoints;
  }
  async initClient() {
    this.initingClient();
    try {
      const keplr = await getKeplrFromExtension();
      this.initClientDone(keplr ? new KeplrClient(keplr) : void 0);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
};
export {
  KeplrExtensionWallet
};
//# sourceMappingURL=main-wallet.mjs.map
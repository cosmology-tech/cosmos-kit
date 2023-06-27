// src/extension/main-wallet.ts
import { MainWalletBase } from "@cosmos-kit/core";

// src/extension/chain-wallet.ts
import { ChainWalletBase } from "@cosmos-kit/core";
var ChainVectisExtension = class extends ChainWalletBase {
  constructor(walletInfo, chainInfo) {
    super(walletInfo, chainInfo);
  }
};

// src/extension/client.ts
import { chainRegistryChainToKeplr } from "@chain-registry/keplr";
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
    const chainInfo = chainRegistryChainToKeplr(
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
import { ClientNotExistError } from "@cosmos-kit/core";
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
      throw ClientNotExistError;
    }
  }
  return new Promise((resolve, reject) => {
    const documentStateChange = (event) => {
      if (event.target && event.target.readyState === "complete") {
        if (vectis) {
          resolve(vectis);
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
var VectisExtensionWallet = class extends MainWalletBase {
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
export {
  VectisExtensionWallet
};
//# sourceMappingURL=main-wallet.mjs.map
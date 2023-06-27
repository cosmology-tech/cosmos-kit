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
export {
  VectisClient
};
//# sourceMappingURL=client.mjs.map
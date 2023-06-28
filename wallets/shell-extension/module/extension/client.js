import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
export class ShellClient {
  constructor(client) {
    _defineProperty(this, "client", void 0);
    this.client = client;
  }
  async enable(chainIds) {
    await this.client.enable(chainIds);
  }
  async suggestToken({
    chainId,
    tokens,
    type
  }) {
    if (type === 'cw20') {
      for (const {
        contractAddress,
        viewingKey
      } of tokens) {
        await this.client.suggestToken(chainId, contractAddress, viewingKey);
      }
    }
  }
  async getSimpleAccount(chainId) {
    const {
      address,
      username
    } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
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
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
    // return this.client.getOfflineSignerAuto(chainId);
  }

  getOfflineSignerAmino(chainId) {
    return this.client.getOfflineSignerOnlyAmino(chainId);
  }
  getOfflineSignerDirect(chainId) {
    return this.client.getOfflineSigner(chainId);
  }
  async addChain(chainInfo) {
    const suggestChain = chainRegistryChainToKeplr(chainInfo.chain, chainInfo.assetList ? [chainInfo.assetList] : []);
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
}
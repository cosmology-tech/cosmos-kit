import { StdSignature } from '@cosmjs/amino';
import { Cosmiframe } from '@dao-dao/cosmiframe';

import {
  ChainRecord,
  SignType,
  WalletAccount,
  WalletClient,
} from '../../types';

export class CosmiframeClient implements WalletClient {
  constructor(private cosmiframe: Cosmiframe) {}

  async getSimpleAccount(...params) {
    return await this.cosmiframe.p.getSimpleAccount(...params);
  }

  async connect(...params) {
    return await this.cosmiframe.p.connect(...params);
  }

  // Cannot implement because the event only makes sense in the context of the
  // DOM where it happened, and references to the iframe's window are not
  // available in the parent.

  // on(_type: string, _listener: EventListenerOrEventListenerObject) {
  //   throw new Error('Not implemented');
  // }

  // off(_type: string, _listener: EventListenerOrEventListenerObject) {
  //   throw new Error('Not implemented');
  // }

  async enable(...params) {
    await this.cosmiframe.p.enable(...params);
  }

  async suggestToken(...params) {
    await this.cosmiframe.p.suggestToken(...params);
  }

  async addChain(...params) {
    // `clientOptions` in the chain record may contain
    // `SigningStargateClientOptions` or `SigningCosmWasmClientOptions`, which
    // may contain a types registry that cannot be cloned when using
    // window.postMessage. `addChain` functions typically do not care about
    // `clientOptions` as they are just used for adding chain metadata to a
    // wallet, so we remove the `clientOptions` from the chain record here.
    let chainRecord: ChainRecord = params[0];
    if (chainRecord && 'clientOptions' in chainRecord) {
      chainRecord = {
        ...chainRecord,
        clientOptions: {},
      };
      params[0] = chainRecord;
    }

    await this.cosmiframe.p.addChain(...params);
  }

  async getAccount(...params) {
    return await this.cosmiframe.p.getAccount<WalletAccount>(...params);
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    if (preferredSignType === 'direct') {
      return this.getOfflineSignerDirect(chainId);
    } else {
      return this.getOfflineSignerAmino(chainId);
    }
  }

  getOfflineSignerAmino(chainId: string) {
    return this.cosmiframe.getOfflineSignerAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.cosmiframe.getOfflineSignerDirect(chainId);
  }

  async sign(...params) {
    return await this.cosmiframe.p.sign(...params);
  }

  async signAmino(...params) {
    return await this.cosmiframe.p.signAmino(...params);
  }

  async signDirect(...params) {
    return await this.cosmiframe.p.signDirect(...params);
  }

  async signArbitrary(...params): Promise<StdSignature> {
    return await this.cosmiframe.p.signArbitrary(...params);
  }

  async getEnigmaPubKey(...params) {
    return await this.cosmiframe.p.getEnigmaPubKey(...params);
  }

  async getEnigmaTxEncryptionKey(...params) {
    return await this.cosmiframe.p.getEnigmaTxEncryptionKey(...params);
  }

  async enigmaEncrypt(...params) {
    return await this.cosmiframe.p.enigmaEncrypt(...params);
  }

  async enigmaDecrypt(...params) {
    return await this.cosmiframe.p.enigmaDecrypt(...params);
  }

  async sendTx(...params) {
    return await this.cosmiframe.p.sendTx(...params);
  }
}

import { StdSignature } from '@cosmjs/amino';

import {
  ChainRecord,
  IFRAME_DEFAULT_LOGO,
  IFRAME_DEFAULT_PRETTY_NAME,
  IFRAME_PARENT_DISCONNECTED,
  SignType,
  SimpleAccount,
  WalletAccount,
  WalletClient,
} from '../../types';
import { IframeWallet } from './main-wallet';
import { iframeExtensionInfo } from './registry';
import { IframeAminoSigner, IframeDirectSigner } from './signers';
import { sendAndListenOnce } from './utils';

export class IframeClient implements WalletClient {
  constructor(private wallet: IframeWallet) {}

  async getSimpleAccount(...params) {
    return await sendAndListenOnce(
      {
        method: 'getSimpleAccount',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response as SimpleAccount;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async connect(...params) {
    await sendAndListenOnce(
      {
        method: 'connect',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          // On connect, update info based on data from parent.
          iframeExtensionInfo.prettyName = data.response.prettyName;
          iframeExtensionInfo.logo = data.response.logo;
        } else if (data.type === 'error') {
          if (data.error === IFRAME_PARENT_DISCONNECTED) {
            // On disconnect, remove parent info.
            iframeExtensionInfo.prettyName = IFRAME_DEFAULT_PRETTY_NAME;
            iframeExtensionInfo.logo = IFRAME_DEFAULT_LOGO;

            await this.wallet.disconnect();
          }

          throw new Error(data.error);
        }
      }
    );
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
    await sendAndListenOnce(
      {
        method: 'enable',
        params,
      },
      async (data) => {
        if (data.type === 'error') {
          throw new Error(data.error);
        }
      }
    );
  }

  async suggestToken(...params) {
    await sendAndListenOnce(
      {
        method: 'suggestToken',
        params,
      },
      async (data) => {
        if (data.type === 'error') {
          throw new Error(data.error);
        }
      }
    );
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

    await sendAndListenOnce(
      {
        method: 'addChain',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response as WalletAccount;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async getAccount(...params) {
    return await sendAndListenOnce(
      {
        method: 'getAccount',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response as WalletAccount;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    if (preferredSignType === 'direct') {
      return this.getOfflineSignerDirect(chainId);
    } else {
      return this.getOfflineSignerAmino(chainId);
    }
  }

  getOfflineSignerAmino(chainId: string) {
    return new IframeAminoSigner(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return new IframeDirectSigner(chainId);
  }

  async sign(...params) {
    return await sendAndListenOnce(
      {
        method: 'sign',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async signAmino(...params) {
    return await sendAndListenOnce(
      {
        method: 'signAmino',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async signDirect(...params) {
    return await sendAndListenOnce(
      {
        method: 'signDirect',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async signArbitrary(...params): Promise<StdSignature> {
    return await sendAndListenOnce(
      {
        method: 'signArbitrary',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async getEnigmaPubKey(...params) {
    return await sendAndListenOnce(
      {
        method: 'getEnigmaPubKey',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async getEnigmaTxEncryptionKey(...params) {
    return await sendAndListenOnce(
      {
        method: 'getEnigmaTxEncryptionKey',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async enigmaEncrypt(...params) {
    return await sendAndListenOnce(
      {
        method: 'enigmaEncrypt',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async enigmaDecrypt(...params) {
    return await sendAndListenOnce(
      {
        method: 'enigmaDecrypt',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }

  async sendTx(...params) {
    return await sendAndListenOnce(
      {
        method: 'sendTx',
        params,
      },
      async (data) => {
        if (data.type === 'success') {
          return data.response;
        } else {
          throw new Error(data.error);
        }
      }
    );
  }
}

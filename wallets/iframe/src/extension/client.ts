import { StdSignature } from '@cosmjs/amino';
import {
  IFRAME_PARENT_DISCONNECTED,
  SignType,
  SimpleAccount,
  WalletAccount,
  WalletClient,
} from '@cosmos-kit/core';

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
          // On connect, update logo to match parent's wallet.
          iframeExtensionInfo.prettyName = `${data.response.prettyName} (iframe)`;
          iframeExtensionInfo.logo = data.response.logo;
        } else if (data.type === 'error') {
          if (data.error === IFRAME_PARENT_DISCONNECTED) {
            await this.wallet.disconnect();
          }

          throw new Error(data.error);
        }
      }
    );
  }

  async disconnect() {
    // Reset metadata on disconnect.
    iframeExtensionInfo.prettyName = 'Iframe Parent';
    iframeExtensionInfo.logo = undefined;
  }

  // TODO: on
  // TODO: off

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

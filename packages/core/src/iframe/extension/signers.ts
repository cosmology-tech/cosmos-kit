import { AminoSignResponse, OfflineAminoSigner } from '@cosmjs/amino';
import {
  AccountData,
  DirectSignResponse,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';

import { sendAndListenOnce } from './utils';

export class IframeDirectSigner implements OfflineDirectSigner {
  constructor(public chainId: string) {}

  async getAccounts(...params): Promise<readonly AccountData[]> {
    return await sendAndListenOnce(
      {
        method: 'signer:getAccounts',
        params,
        chainId: this.chainId,
        signType: 'direct',
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

  async signDirect(...params): Promise<DirectSignResponse> {
    return await sendAndListenOnce(
      {
        method: 'signer:signDirect',
        params,
        chainId: this.chainId,
        signType: 'direct',
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

export class IframeAminoSigner implements OfflineAminoSigner {
  constructor(public chainId: string) {}

  async getAccounts(...params): Promise<readonly AccountData[]> {
    return await sendAndListenOnce(
      {
        method: 'signer:getAccounts',
        params,
        chainId: this.chainId,
        signType: 'amino',
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

  async signAmino(...params): Promise<AminoSignResponse> {
    return await sendAndListenOnce(
      {
        method: 'signer:signAmino',
        params,
        chainId: this.chainId,
        signType: 'amino',
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

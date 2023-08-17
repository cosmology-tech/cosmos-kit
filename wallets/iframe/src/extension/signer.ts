import { AminoSignResponse, OfflineAminoSigner } from '@cosmjs/amino';
import {
  AccountData,
  DirectSignResponse,
  OfflineDirectSigner,
} from '@cosmjs/proto-signing';
import { SignType } from '@cosmos-kit/core';

import { sendAndListenOnce } from './utils';

export class IframeSigner implements OfflineDirectSigner, OfflineAminoSigner {
  chainId: string;
  signType: SignType;

  constructor(chainId: string, signType: SignType) {
    this.chainId = chainId;
    this.signType = signType;
  }

  async getAccounts(...params): Promise<readonly AccountData[]> {
    return await sendAndListenOnce(
      {
        method: 'signer:getAccounts',
        params,
        chainId: this.chainId,
        signType: this.signType,
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
        signType: this.signType,
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
        signType: this.signType,
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

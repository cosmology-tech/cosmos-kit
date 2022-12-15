/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignDoc,
} from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

import { WCAccount } from './types';

export class WCClientV2 implements WalletClient {
  readonly signClient: SignClient;

  constructor(signClient: SignClient) {
    this.signClient = signClient;
  }

  get session(): SessionTypes.Struct {
    const ss = this.signClient.session;
    if (ss.length) {
      const lastKeyIndex = ss.keys.length - 1;
      const session = ss.get(ss.keys[lastKeyIndex]);
      console.log('RESTORED SESSION:', session);
      return session;
    }
    throw new Error('Session is not proposed yet.');
  }

  async getAccount(chainId: string) {
    const result = ((await this.signClient.request({
      topic: this.session.topic,
      chainId: chainId,
      request: {
        method: 'cosmos_getAccounts',
        params: {},
      },
    })) as any)['result'][0] as WCAccount;

    return {
      address: result.address,
      algo: result.algo,
      pubkey: Buffer.from(result.pubkey, 'hex'),
      isNanoLedger: result.isNanoLedger,
    };
  }

  getOfflineSignerAmino(chainId: string) {
    return {
      getAccounts: async () => {
        return [await this.getAccount(chainId)];
      },
      signAmino: (signerAddress: string, signDoc: StdSignDoc) =>
        this.signAmino(chainId, signerAddress, signDoc),
    } as OfflineAminoSigner;
  }

  getOfflineSignerDirect(chainId: string) {
    return {
      getAccounts: async () => {
        return [await this.getAccount(chainId)];
      },
      signDirect: (signerAddress: string, signDoc: DirectSignDoc) =>
        this.signDirect(chainId, signerAddress, signDoc),
    } as OfflineDirectSigner;
  }

  async getOfflineSigner(chainId: string) {
    const key = await this.getAccount(chainId);
    if (key.isNanoLedger || typeof key.isNanoLedger === 'undefined') {
      return this.getOfflineSignerAmino(chainId);
    }
    return this.getOfflineSignerDirect(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ): Promise<AminoSignResponse> {
    return ((await this.signClient.request({
      topic: this.session.topic,
      chainId: chainId,
      request: {
        method: 'cosmos_signAmino',
        params: {
          signerAddress: signer,
          signDoc,
        },
      },
    })) as any)['result'] as AminoSignResponse;
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ): Promise<DirectSignResponse> {
    return ((await this.signClient.request({
      topic: this.session.topic,
      chainId: chainId,
      request: {
        method: 'cosmos_signDirect',
        params: {
          signerAddress: signer,
          signDoc,
        },
      },
    })) as any)['result'] as DirectSignResponse;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Algo,
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
      return session;
    }
    throw new Error('Session is not proposed yet.');
  }

  async disconnect() {
    console.log('%cclient.ts line:35 123', 'color: #007acc;', 123);
    await this.signClient.disconnect({
      topic: this.session.topic,
      reason: {
        code: 201,
        message: 'disconnect wallet',
      },
    });
  }

  async getAccount(chainId: string) {
    // const resp = await this.signClient.request({
    //   topic: this.session.topic,
    //   chainId: `cosmos:${chainId}`,
    //   request: {
    //     method: 'cosmos_getAccounts',
    //     params: {},
    //   },
    // });
    // const result = (resp as any)['result'][0] as WCAccount;

    // return {
    //   address: result.address,
    //   algo: result.algo,
    //   pubkey: Buffer.from(result.pubkey, 'hex'),
    //   isNanoLedger: result.isNanoLedger,
    // };

    const { namespaces, self } = this.session;

    return {
      address: namespaces.cosmos.accounts[0].split(':')[2],
      algo: 'secp256k1' as Algo,
      pubkey: Buffer.from(self.publicKey, 'hex'),
      isNanoLedger: false,
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
      chainId: `cosmos:${chainId}`,
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
      chainId: `cosmos:${chainId}`,
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

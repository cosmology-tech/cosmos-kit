/* eslint @typescript-eslint/no-explicit-any: 0 */ // --> OFF

import {
  encodeEd25519Pubkey,
  encodeSecp256k1Pubkey,
  pubkeyType,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  DirectSignDoc,
  SignOptions,
  SignType,
  WalletClient,
} from '@cosmos-kit/core';
import { CapsuleProvider } from '@leapwallet/cosmos-social-login-capsule-provider';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

export class CosmosCapsuleClient implements WalletClient {
  readonly loginProvider: CapsuleProvider;

  constructor(options: { loginProvider: CapsuleProvider }) {
    this.loginProvider = options.loginProvider;
  }

  async disconnect() {
    await this.loginProvider.disconnect();
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async enable() {
    await this.handleConnect();
  }

  async handleConnect() {
    await this.loginProvider.handleConnect();
  }

  async getAccount(chainId: string) {
    return this.loginProvider.getAccount(chainId);
  }

  getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    return this.loginProvider.getOfflineSigner(chainId, preferredSignType);
  }

  getOfflineSignerAmino(chainId: string): any {
    return this.loginProvider.getOfflineSignerAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string): any {
    return this.loginProvider.getOfflineSignerDirect(chainId);
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return this.loginProvider.signAmino(chainId, signer, signDoc, signOptions);
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    const account = await this.getAccount(chainId);
    if (!account) {
      throw new Error(`Wallet not connected to account ${signer}`);
    }
    const pubkey = (() => {
      switch (account.algo) {
        case 'secp256k1':
          return encodeSecp256k1Pubkey(account.pubkey);
        case 'ed25519':
          return encodeEd25519Pubkey(account.pubkey);
        default:
          throw new Error('sr25519 public key algorithm is not supported');
      }
    })();

    const signature = await this.loginProvider.signArbitrary(
      chainId,
      signer,
      data
    );

    return {
      signature,
      pub_key: {
        type:
          account.algo === 'secp256k1'
            ? pubkeyType.secp256k1
            : pubkeyType.ed25519,
        value: pubkey.value,
      },
    };
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc
  ): Promise<any> {
    return this.loginProvider.signDirect(
      chainId,
      signer,
      signDoc as unknown as SignDoc
    );
  }
}

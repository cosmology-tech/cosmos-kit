// @ts-nocheck
import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing';

import Long from 'long';

import { Key, Mock, MockSignOptions } from '../mock-extension/extension/types';
import { BroadcastMode } from '../../src/types';

export class MockWallet implements Mock {
  defaultOptions = {
    sign: {
      preferNoSetFee: false,
      preferNoSetMemo: false,
      disableBalanceCheck: false,
    },
  };

  mode = 'extension' as const;

  async disconnect(): Promise<void> {
    // Simulate disconnect logic
  }

  async enable(chainIds: string | string[]): Promise<void> {
    // Simulate enabling logic
  }

  async suggestToken(chainId: string, contractAddress: string): Promise<void> {
    // Simulate suggesting a token
  }

  async suggestCW20Token(
    chainId: string,
    contractAddress: string
  ): Promise<void> {
    // Simulate suggesting a CW20 token
  }

  async getKey(chainId: string): Promise<Key> {
    return {
      name: 'Test Key',
      algo: 'secp256k1',
      pubKey: new Uint8Array(),
      address: new Uint8Array(),
      bech32Address: 'cosmos1...',
      isNanoLedger: false,
    };
  }

  async getOfflineSigner(
    chainId: string
  ): OfflineAminoSigner & OfflineDirectSigner {
    return {
      // Implement Offline Signer logic as needed
      getAccounts: jest.fn(),
      signAmino: jest.fn(),
    } as OfflineAminoSigner & OfflineDirectSigner;
  }

  async getOfflineSignerOnlyAmino(
    chainId: string
  ): OfflineAminoSigner {
    return {
      // Implement Offline Amino Signer logic as needed
      getAccounts: jest.fn(),
      signAmino: jest.fn(),
    } as OfflineAminoSigner;
  }

  async getOfflineSignerAuto(chainId: string): Promise<OfflineSigner> {
    return {
      // Implement Auto Signer logic as needed
      getAccounts: jest.fn(),
      signAmino: jest.fn(),
    } as OfflineSigner;
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: MockSignOptions
  ): Promise<AminoSignResponse> {
    return {
      signed: signDoc,
      signature: new Uint8Array(),
    };
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      bodyBytes?: Uint8Array | null;
      authInfoBytes?: Uint8Array | null;
      chainId?: string | null;
      accountNumber?: Long | null;
    },
    signOptions?: MockSignOptions
  ): Promise<DirectSignResponse> {
    return {
      signed: signDoc,
      signature: new Uint8Array(),
    };
  }

  async signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature> {
    return {
      pubKey: new Uint8Array(),
      signature: new Uint8Array(),
    };
  }

  async getEnigmaPubKey(chainId: string): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async getEnigmaTxEncryptionKey(
    chainId: string,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async enigmaEncrypt(
    chainId: string,
    contractCodeHash: string,
    msg: object
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async enigmaDecrypt(
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array> {
    return new Uint8Array();
  }

  async experimentalSuggestChain(chainInfo: ChainInfo): Promise<void> {
    // Simulate suggesting a chain
  }
}

import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  OfflineDirectSigner,
  OfflineSigner,
  DirectSignResponse,
} from '@cosmjs/proto-signing';
import { BroadcastMode } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';

export interface Key {
  readonly name: string;
  readonly algo: string;
  readonly pubKey: Uint8Array;
  readonly address: Uint8Array;
  readonly bech32Address: string;
  readonly isNanoLedger: boolean;
}

export interface OktoSignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface Okto {

  defaultOptions: {
    sign?: OktoSignOptions;
  };

  disconnect(): Promise<void>;

  enable(chainIds: string | string[]): Promise<void>;

  suggestToken(chainId: string, contractAddress: string): Promise<void>;

  suggestCW20Token(chainId: string, contractAddress: string): Promise<void>;

  mode: 'extension';

  getKey(chainId: string): Promise<Key>;

  getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;

  getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;

  getOfflineSignerAuto(chainId: string): Promise<OfflineSigner>;

  signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: OktoSignOptions
  ): Promise<AminoSignResponse>;

  signDirect(
    chainId: string,
    signer: string,
    signDoc: {
      bodyBytes?: Uint8Array | null;
      authInfoBytes?: Uint8Array | null;
      chainId?: string | null;
      accountNumber?: Long | null;
    },
    signOptions?: OktoSignOptions
  ): Promise<DirectSignResponse>;

  signArbitrary(
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ): Promise<StdSignature>;

  getEnigmaPubKey(chainId: string): Promise<Uint8Array>;

  getEnigmaTxEncryptionKey(
    chainId: string,
    nonce: Uint8Array
  ): Promise<Uint8Array>;

  enigmaEncrypt(
    chainId: string,
    contractCodeHash: string,
    msg: object
  ): Promise<Uint8Array>;

  enigmaDecrypt(
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ): Promise<Uint8Array>;

  sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array>;
  
  experimentalSuggestChain(chainInfo: ChainInfo): Promise<void>;
}

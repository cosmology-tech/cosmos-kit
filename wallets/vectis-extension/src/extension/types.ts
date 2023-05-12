import {
  AccountData,
  Algo,
  AminoSignResponse,
  OfflineAminoSigner,
  StdSignature,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  DirectSignResponse,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { BroadcastMode, DirectSignDoc } from '@cosmos-kit/core';
import type { ChainInfo } from '@keplr-wallet/types';

export type { ChainInfo };
export interface VectisWindow extends Window {
  readonly vectis: {
    readonly version: string;
    readonly cosmos: Vectis;
  };
}

export interface Vectis {
  suggestChains(chainsInfo: ChainInfo[]): Promise<void>;
  enable(chainIds: string | string[]): Promise<void>;
  getSupportedChains(): Promise<ChainInfo[]>;
  getKey(chainId: string): Promise<KeyInfo>;
  getAccounts(chainId: string): Promise<AccountData[]>;
  signAmino(signerAddress: string, doc: StdSignDoc): Promise<AminoSignResponse>;
  signDirect(
    signerAddress: string,
    doc: DirectSignDoc
  ): Promise<DirectSignResponse>;
  signArbitrary(
    chainId: string,
    signerAddress: string,
    data: string | Uint8Array
  ): Promise<StdSignature>;
  getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
  getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
  getOfflineSigner(chainId: string): OfflineSigner;
  sendTx(
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ): Promise<Uint8Array>;
}

type KeyInfo = {
  readonly name: string;
  readonly algo: Algo;
  readonly address: string;
  readonly isNanoLedger: boolean;
  readonly isVectisAccount: boolean;
  readonly pubkey: Uint8Array;
};

import {
  AminoSignResponse,
  OfflineAminoSigner,
  StdFee,
  StdSignDoc,
} from '@cosmjs/amino';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import {
  DirectSignResponse,
  EncodeObject,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import {
  DeliverTxResponse,
  SigningStargateClient,
  SigningStargateClientOptions,
  StargateClient,
  StargateClientOptions,
} from '@cosmjs/stargate';
import {
  ChainName,
  ChainWalletContext,
  SignOptions,
  WalletClient,
} from '@cosmos-kit/core';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { NameService } from './name-service';

export type NameServiceName = string;
export type Bech32Address = string;

export interface NameServiceRegistry {
  name: NameServiceName;
  contract: string;
  chainName: ChainName;
  getQueryMsg: (address: Bech32Address) => any;
  slip173: string;
}

export type CosmosClientType = 'stargate' | 'cosmwasm';
export type CosmosSignType = 'amino' | 'direct';

export interface DirectSignDoc {
  /** SignDoc bodyBytes */
  bodyBytes?: Uint8Array | null;
  /** SignDoc authInfoBytes */
  authInfoBytes?: Uint8Array | null;
  /** SignDoc chainId */
  chainId?: string | null;
  /** SignDoc accountNumber */
  accountNumber?: Long | null;
}

export declare enum BroadcastMode {
  /** Return after tx commit */
  Block = 'block',
  /** Return after CheckTx */
  Sync = 'sync',
  /** Return right away */
  Async = 'async',
}

export interface CosmosClientOptions {
  signingStargate?: SigningStargateClientOptions;
  signingCosmwasm?: SigningCosmWasmClientOptions;
  stargate?: StargateClientOptions;
  preferredSignType?: CosmosSignType;
}

export interface CosmosWalletClient extends WalletClient {
  getOfflineSigner?: (
    chainId: string,
    preferredSignType?: CosmosSignType // by default `amino`
  ) => Promise<OfflineSigner> | OfflineSigner;
  getOfflineSignerAmino?: (chainId: string) => OfflineAminoSigner;
  getOfflineSignerDirect?: (chainId: string) => OfflineDirectSigner;
  signAmino?: (
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect?: (
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) => Promise<DirectSignResponse>;
  getEnigmaPubKey?: (chainId: string) => Promise<Uint8Array>;
  getEnigmaTxEncryptionKey?: (
    chainId: string,
    nonce: Uint8Array
  ) => Promise<Uint8Array>;
  enigmaEncrypt?: (
    chainId: string,
    contractCodeHash: string,
    msg: object
  ) => Promise<Uint8Array>;
  enigmaDecrypt?: (
    chainId: string,
    ciphertext: Uint8Array,
    nonce: Uint8Array
  ) => Promise<Uint8Array>;
  sendTx?: (
    chainId: string,
    tx: Uint8Array,
    mode: BroadcastMode
  ) => Promise<Uint8Array>;
}

export interface CosmosChainWalletContext extends ChainWalletContext {
  getStargateClient: () => Promise<StargateClient>;
  getCosmWasmClient: () => Promise<CosmWasmClient>;
  getSigningStargateClient: () => Promise<SigningStargateClient>;
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
  getNameService: () => Promise<NameService>;

  estimateFee: (
    messages: EncodeObject[],
    type?: CosmosClientType,
    memo?: string,
    multiplier?: number
  ) => Promise<StdFee>;
  sign: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<TxRaw>;
  broadcast: (
    signedMessages: TxRaw,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;
  signAndBroadcast: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse>;

  getOfflineSigner: () => OfflineSigner;
  getOfflineSignerAmino: () => OfflineAminoSigner;
  getOfflineSignerDirect: () => OfflineDirectSigner;
  signAmino: (
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect: (
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) => Promise<DirectSignResponse>;
  sendTx(tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

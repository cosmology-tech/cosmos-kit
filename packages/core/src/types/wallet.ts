/* eslint-disable @typescript-eslint/no-explicit-any */
import { AssetList, Chain } from '@chain-registry/types';
import { AminoSignResponse, StdFee, StdSignDoc } from '@cosmjs/amino';
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from '@cosmjs/cosmwasm-stargate';
import {
  Algo,
  DirectSignResponse,
  EncodeObject,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import {
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
} from '@cosmjs/stargate';
import { IConnector } from '@walletconnect/types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { IconType } from 'react-icons';

import { ChainWalletBase, MainWalletBase } from '../bases';
import { WalletRepo } from '../repository';
import { ChainWalletConnect } from '../wallet-connect';
import { ChainRecord } from './chain';
import { AppEnv, CosmosClientType, Data, OS } from './common';

export type WalletName = string;

export enum WalletStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  NotExist = 'NotExist',
  Rejected = 'Rejected',
  Error = 'Error',
}

export interface DownloadInfo extends AppEnv {
  icon: IconType;
  link: string;
}

export type WalletMode = 'extension' | 'wallet-connect';

export interface Wallet {
  name: WalletName;
  prettyName: string;
  mode: WalletMode;
  mobileDisabled: boolean;
  rejectMessage?:
    | {
        source: string; // message from wallet app
        target?: string; // message stored in walletManager, default 'Request Rejected!'
      }
    | string; // message from wallet app
  rejectCode?: number; // code from wallet app
  connectEventNames?: string[];
  downloads?: DownloadInfo[];
  logo?: string;
}

export interface WalletAccount {
  address: string;
  pubkey: Uint8Array;
  name?: string;
  algo?: Algo;
}

export interface SignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface WalletClient {
  getAccount: (chainId: string) => Promise<WalletAccount>;
  getOfflineSigner: (chainId: string) => Promise<OfflineSigner> | OfflineSigner;

  enable?: (chainIds: string | string[]) => Promise<void>;
  addChain?: (chainInfo: ChainRecord) => Promise<void>;
  getOfflineSignerOnlyAmino?: (chainId: string) => OfflineSigner;
  getOfflineSignerAuto?: (
    chainId: string
  ) => Promise<OfflineSigner | OfflineDirectSigner>;
  signAmino?: (
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions: SignOptions
  ) => Promise<AminoSignResponse>;
  signDirect?: (
    chainId: string,
    signer: string,
    signDoc: {
      /** SignDoc bodyBytes */
      bodyBytes?: Uint8Array | null;
      /** SignDoc authInfoBytes */
      authInfoBytes?: Uint8Array | null;
      /** SignDoc chainId */
      chainId?: string | null;
      /** SignDoc accountNumber */
      accountNumber?: Long | null;
    }
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
}

export interface WalletConnectClient extends WalletClient {
  readonly connector: IConnector;
  getAppUrl: (os?: OS) => string | undefined;
  readonly qrUrl: string;
}

export interface ChainWalletData extends Data {
  username?: string;
  address?: string;
  offlineSigner?: OfflineSigner;
}

export interface MainWalletData extends Data {
  username?: string;
}

export type WalletData = ChainWalletData & MainWalletData;
export type WalletAdapter = ChainWalletBase | MainWalletBase;

export interface IChainWallet {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}

export interface IChainWalletConnect {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletConnect;
}

export interface IWalletConnectClient {
  new (): WalletConnectClient;
}

export interface ChainContext {
  // walletRepo: WalletRepo;
  // wallet: ChainWalletBase | undefined;

  chain: Chain;
  assets: AssetList | undefined;
  logoUrl: string | undefined;
  address: string | undefined;
  username: string | undefined;
  message: string | undefined;
  status: WalletStatus;

  openView: () => void;
  connect: (wallet?: WalletName) => Promise<void>;
  disconnect: () => Promise<void>;
  getRpcEndpoint: () => Promise<string | undefined>;
  getRestEndpoint: () => Promise<string | undefined>;
  getStargateClient: () => Promise<StargateClient | undefined>;
  getCosmWasmClient: () => Promise<CosmWasmClient | undefined>;
  getSigningStargateClient: () => Promise<SigningStargateClient | undefined>;
  getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>;
  estimateFee: (
    messages: EncodeObject[],
    type?: CosmosClientType,
    memo?: string,
    multiplier?: number
  ) => Promise<StdFee | undefined>;
  sign: (
    messages: EncodeObject[],
    fee: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<TxRaw | undefined>;
  broadcast: (
    signedMessages: TxRaw,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse | undefined>;
  signAndBroadcast: (
    messages: EncodeObject[],
    fee?: StdFee,
    memo?: string,
    type?: CosmosClientType
  ) => Promise<DeliverTxResponse | undefined>;
}

import {
  AccountData,
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
import { SignClientTypes } from '@walletconnect/types';

import { ChainWalletBase, MainWalletBase } from '../bases';
import { ChainName, ChainRecord } from './chain';
import { DappEnv, Mutable, OS, SignType } from './common';

export interface Key {
  readonly name: string;
  readonly algo: string;
  readonly pubKey: Uint8Array;
  readonly address: Uint8Array;
  readonly bech32Address: string;
  readonly isNanoLedger: boolean;
  readonly isSmartContract?: boolean;
}

export interface SimpleAccount {
  namespace: string;
  chainId: string;
  address: string;
  username?: string;
}

export type WalletName = string;

export enum WalletStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  NotExist = 'NotExist',
  Rejected = 'Rejected',
  Error = 'Error',
}

export interface DownloadInfo extends DappEnv {
  icon?: string | ((props: any) => JSX.Element); // i.e. { IconType } from 'react-icons';
  link: string;
}

export type WalletMode =
  | 'ledger'
  | 'extension'
  | 'wallet-connect'
  | 'social-login';

export interface Metadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface AppUrl {
  native?:
  | string
  | {
    android?: string;
    ios?: string;
    macos?: string;
    windows?: string;
  };
  universal?: string;
}

export interface Wallet {
  name: WalletName;
  prettyName: string;
  mode: WalletMode;
  extends?: 'MetaMask';
  mobileDisabled: boolean | (() => boolean);
  description?: string;
  rejectMessage?:
  | {
    source: string; // message from wallet app
    target?: string; // message stored in walletManager, default 'Request Rejected!'
  }
  | string; // message from wallet app
  rejectCode?: number; // code from wallet app
  connectEventNamesOnWindow?: string[];
  connectEventNamesOnClient?: string[];
  supportedChains?: string[]; // array of supported chains
  downloads?: DownloadInfo[];
  logo?: string | { major: string; minor: string };
  walletconnect?: {
    name: string;
    projectId: string;
    requiredNamespaces?: {
      methods: string[];
      events: string[];
    };
    encoding?: BufferEncoding; // encoding for bytes, default 'hex'
    mobile?: AppUrl; // redirect link on mobile
    formatNativeUrl?: (
      appUrl: string,
      wcUri: string,
      os: OS | undefined,
      name: string
    ) => string;
    formatUniversalUrl?: (
      appUrl: string,
      wcUri: string,
      name: string
    ) => string;
  };
}

export type Bech32Address = string;

export interface WalletAccount extends AccountData {
  username?: string;
  isNanoLedger?: boolean;
  isSmartContract?: boolean;
}

export interface SignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export interface DirectSignDoc {
  /** SignDoc bodyBytes */
  bodyBytes: Uint8Array | null;
  /** SignDoc authInfoBytes */
  authInfoBytes: Uint8Array | null;
  /** SignDoc chainId */
  chainId: string | null;
  /** SignDoc accountNumber */
  accountNumber: bigint | null;
}

export declare enum BroadcastMode {
  /** Return after tx commit */
  Block = 'block',
  /** Return after CheckTx */
  Sync = 'sync',
  /** Return right away */
  Async = 'async',
}

export interface SuggestCW20Token {
  contractAddress: string;
  viewingKey?: string;
  imageURL?: string;
  coinGeckoId?: string;
}

export const SuggestTokenTypes = {
  CW20: 'cw20',
  ERC20: 'erc20',
} as const;

export type SuggestTokenType =
  typeof SuggestTokenTypes[keyof typeof SuggestTokenTypes];

export interface SuggestToken {
  chainId: string;
  chainName: string;
  type: SuggestTokenType;
  tokens: SuggestCW20Token[];
}

export interface WalletClient {
  getSimpleAccount: (chainId: string) => Promise<SimpleAccount>;

  qrUrl?: Mutable<string>;
  appUrl?: Mutable<AppUrl>;

  connect?: (chainIds: string | string[], options?: any) => Promise<void>; // called when chain wallet connect is called
  disconnect?: (options?: DisconnectOptions) => Promise<void>; // called when wallet disconnect is called
  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  enable?: (chainIds: string | string[]) => Promise<void>;
  suggestToken?: (data: SuggestToken) => Promise<void>;
  addChain?: (chainInfo: ChainRecord) => Promise<void>;
  getAccount?: (chainId: string) => Promise<WalletAccount>;
  getOfflineSigner?: (
    chainId: string,
    preferredSignType?: SignType // by default `amino`
  ) => Promise<OfflineSigner> | OfflineSigner;
  getOfflineSignerAmino?: (chainId: string) => OfflineAminoSigner;
  getOfflineSignerDirect?: (chainId: string) => OfflineDirectSigner;

  readonly defaultSignOptions?: SignOptions;
  setDefaultSignOptions?: (options: SignOptions) => void;

  sign?: (
    signDoc: StdSignDoc,
    accountIndex?: number
  ) => Promise<{
    signature: null | Buffer;
    return_code: number | string;
  }>;
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
  signArbitrary?: (
    chainId: string,
    signer: string,
    data: string | Uint8Array
  ) => Promise<StdSignature>;
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

export type WalletAdapter = ChainWalletBase | MainWalletBase;

export interface IChainWallet {
  new(walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}

export type NameServiceName = string;

export interface NameServiceRegistry {
  name: NameServiceName;
  contract: string;
  chainName: ChainName;
  getQueryMsg: (address: Bech32Address) => any;
  slip173: string;
}

export interface WalletConnectOptions {
  signClient: { projectId: string } & SignClientTypes.Options;
}

export interface DisconnectOptions {
  walletconnect?: {
    removeAllPairings?: boolean;
  };
}

export interface ModalOptions {
  mobile?: {
    displayQRCodeEveryTime?: boolean; // if true, means remove all pairings when disconnect
  };
}

export interface CallbackOptions {
  beforeConnect?: { disconnect?: DisconnectOptions };
}

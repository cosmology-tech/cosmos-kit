import { SignClientTypes } from '@walletconnect/types';

import { ChainWallet, MainWallet } from '../bases';
import { ChainRecord } from './chain';
import { DappEnv, Mutable } from './common';

export interface Key {
  readonly name: string;
  readonly algo: string;
  readonly pubKey: Uint8Array;
  readonly address: Uint8Array;
  readonly bech32Address: string;
  readonly isNanoLedger: boolean;
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

export type WalletMode = 'extension' | 'wallet-connect';

export interface Metadata {
  name: string;
  description: string;
  url: string;
  icons: string[];
}

export interface AppUrl {
  native?: string;
  universal?: string;
}

export interface Wallet {
  name: WalletName;
  prettyName: string;
  mode: WalletMode;
  mobileDisabled: boolean;
  rejectMessage?: string; // message from wallet app
  rejectCode?: number; // code from wallet app
  connectEventNamesOnWindow?: string[];
  connectEventNamesOnClient?: string[];
  downloads?: DownloadInfo[];
  logo?: string;
  walletconnect?: {
    name: string;
    projectId: string;
    encoding?: BufferEncoding; // encoding for bytes, default 'hex'
    mobile?: AppUrl; // redirect link on mobile
    formatNativeUrl?: (appUrl: string, wcUri: string, name: string) => string;
    formatUniversalUrl?: (
      appUrl: string,
      wcUri: string,
      name: string
    ) => string;
  };
}

export interface SignOptions {
  readonly preferNoSetFee?: boolean;
  readonly preferNoSetMemo?: boolean;
  readonly disableBalanceCheck?: boolean;
}

export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';
export type Namespace =
  | 'cosmos'
  | 'ethereum'
  | 'solana'
  | 'stella'
  | 'tezos'
  | 'near';
export interface EncodedString {
  value: string;
  encoding: BufferEncoding;
}

export interface WalletAccount {
  /**
   * identifier in BlockChain.
   * in Cosmos, it's the address formatted using Bech32;
   */
  address: string;
  namespace: Namespace;
  chainId?: string;
}

export interface HttpEndpoint {
  /**
   * The URL of the HTTP endpoint.
   */
  readonly url: string;
  /**
   * HTTP headers that are sent with every request, such as authorization information.
   */
  readonly headers: Record<string, string>;
}

export interface WalletClient {
  /**
   * Step 1: Connect/Authorize
   *     or called `onboard/requestAccount/enable` in some wallets,
   *     to build authed connection between dapp and wallet.
   *     in some wallets (Cosmos wallets in particular) the authorization may down to the level of chains/networks.
   *     to distinguish with `connect` method in ChainWallet, we make it `enable` here.
   */
  connect?(chainIds?: string[]): Promise<void>;
  /**
   * Step 2: Get Account
   *     `address` especially required in returned value.
   *     `address` is the user identifier in BlockChain, directing to a public/private key pair.
   *     in Cosmos it's `Bech32Address`, which varies among chains/networks.
   *     in other ecosystem it could be public key and irrespective of chains/networks.
   */
  getAccount(chainIds?: string[]): Promise<WalletAccount[]>;
  /**
   * Step 3: Sign Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   */
  sign<T>(address: string, doc: T): Promise<EncodedString>;
  /**
   * Step 4: Broadcast Signed Doc
   *     address in params is used to get the public key from wallet to verify signedDoc.
   *     endpoint is the path to do verification and broadcast.
   *     return the hash of new block.
   */
  broadcast?<T>(address: string, signedDoc: T): Promise<EncodedString>;
  /**
   * Step 5: Disconnect/Cancel Authorization
   */
  disconnect?: (chainIds?: string[]) => Promise<void>;

  qrUrl?: Mutable<string>;
  appUrl?: Mutable<AppUrl>;

  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  addChain?<T>(chainInfo: T): Promise<void>;
}

export type WalletAdapter = ChainWallet | MainWallet;

export interface IChainWallet {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWallet;
}

export interface WalletConnectOptions {
  signClient: { projectId: string } & SignClientTypes.Options;
}

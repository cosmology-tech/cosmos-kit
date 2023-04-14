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

export type Namespace =
  | 'cosmos'
  | 'ethereum'
  | 'solana'
  | 'stella'
  | 'tezos'
  | 'near'
  | 'aptos'
  | 'sui';

export interface EncodedString {
  value: string;
  encoding?: BufferEncoding | 'bech32';
}

export interface PublicKey extends EncodedString {
  algo?: string;
}

export interface WalletAccount {
  /**
   * identifier in BlockChain.
   * in Cosmos, it's the address formatted using Bech32;
   */
  address: EncodedString;
  namespace: Namespace;
  chainId?: string;
  publicKey?: PublicKey;
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

export interface Signature {
  signature: EncodedString;
  publicKey?: PublicKey;
}

export interface Block {
  hash: EncodedString;
}

/**
 * authed chain distribution across namespaces
 */
export type AuthRange = {
  [k in Namespace]?: {
    chainIds?: string[];
  };
};

export interface WalletClient {
  /**
   * 1: Connect/Authorize
   *     or called `onboard/requestAccount/enable` in some wallets,
   *     to build authed connection between dapp and wallet.
   *     in some wallets (Cosmos wallets in particular) the authorization may down to the level of chains/networks.
   *     to distinguish with `connect` method in ChainWallet, we make it `enable` here.
   */
  connect?(authRange: AuthRange): Promise<void>;
  /**
   * Step 2: Add Chain
   *     If the target network/chain is not supported by the wallet, you can choose to register the target chain to
   *     the wallet before other actions.
   */
  addChain?(namespace: Namespace, chainInfo: unknown): Promise<void>;
  /**
   * 2: Switch Chain
   *     Some wallets only supports interacting with one chain at a time. We call this the wallet’s “active chain”.
   *     This method enables dapps to request that the wallet switches its active chain to whichever one is required by the dapp,
   *     if the wallet has a concept thereof.
   */
  switchChain?(namespace: Namespace, chainId: string): Promise<void>;
  /**
   * 3: Get Account
   *     `address` especially required in returned value.
   *     `address` is the user identifier in BlockChain, directing to a public/private key pair.
   *     in Cosmos it's `Bech32Address`, which varies among chains/networks.
   *     in other ecosystem it could be public key and irrespective of chains/networks.
   */
  getAccounts(authRange: AuthRange): Promise<WalletAccount[]>;
  /**
   * 4: Sign Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   */
  sign?(
    namespace: Namespace,
    doc: unknown,
    signerAddress?: string,
    chainId?: string,
    options?: unknown
  ): Promise<Signature>;
  /**
   * 5: Sign Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   */
  verify?(
    namespace: Namespace,
    doc: unknown,
    signature: Signature,
    signerAddress?: string,
    chainId?: string
  ): Promise<boolean>;
  /**
   * 6: Broadcast Signed Doc
   *     address in params is used to get the public key from wallet to verify signedDoc.
   *     endpoint is the path to do verification and broadcast.
   *     return the new block.
   */
  broadcast?<T>(
    namespace: Namespace,
    signedDoc: T,
    signerAddress?: string,
    chainId?: string
  ): Promise<Block>;
  /**
   * 7: Sign and Broadcast Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   */
  signAndBroadcast(
    namespace: Namespace,
    doc: unknown,
    signerAddress?: string,
    chainId?: string,
    options?: unknown
  ): Promise<Block>;
  /**
   * 8: Disconnect/Cancel Authorization
   */
  disconnect?: (authRange: AuthRange) => Promise<void>;

  qrUrl?: Mutable<string>;
  appUrl?: Mutable<AppUrl>;

  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

export type WalletAdapter = ChainWallet | MainWallet;

export interface IChainWallet {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWallet;
}

export interface WalletConnectOptions {
  signClient: { projectId: string } & SignClientTypes.Options;
}

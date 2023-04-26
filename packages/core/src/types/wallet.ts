import { ChainWalletBase, MainWalletBase } from '../bases';
import { ChainRecord } from './chain';
import { DappEnv, EncodedString, Mutable } from './common';

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
  | 'everscale'
  | 'aptos'
  | 'sui';

export interface EncodedAddress {
  value: string;
  encoding?: BufferEncoding | 'bech32';
}

export interface PublicKey extends EncodedString {
  /**
   * digital key scheme algorithm
   */
  algo?: string;
}

/**
 * At least address or publicKey should exist
 */
export interface WalletAccount {
  address?: EncodedAddress;
  publicKey?: PublicKey;
  /**
   * some contracts provides readable address/publicKey representation service, like domain for an ip.
   * `name` is unique like address/publicKey, different from `username` in some wallet
   */
  name?: string;
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

export interface Signature {
  signature: EncodedString;
  publicKey?: PublicKey;
  signedDoc?: unknown;
}

export interface Block {
  hash: EncodedString;
  height?: string;
  timestamp?: string;
}

/**
 * usually in returned type of functions with requesting,
 * in case the request response has more info than type param T (usually is a standardized type).
 * if raw is undefined, means all info are already included in T
 */
export type AddRaw<T> = T & { raw?: unknown };

/**
 * authed chain distribution across namespaces
 */
export type AuthRange = {
  [k in Namespace]?: {
    chainIds?: string[];
  };
};

/**
 * Keys corresponding methods in WalletClient interface
 */
export interface WalletClientOptions {
  enableOptions?: unknown;
  addChainOptions?: unknown;
  switchChainOptions?: unknown;
  getAccountsOptions?: unknown;
  signOptions?: unknown;
  verifyOptions?: unknown;
  broadcastOptions?: unknown;
  signAndBroadcastOptions?: unknown;
  disableOptions?: unknown;
}

/**
 * A standardized WalletCLient interface suitable for all kinds if networks
 */
export interface WalletClient {
  options?: WalletClientOptions;

  // --------------------------------------------------------------------------------------------------------------
  //                                                AUTH RELATED
  // --------------------------------------------------------------------------------------------------------------

  /**
   * 1: Enable/Authorize Connection
   *     Or called `onboard/requestAccount/connect` in some wallets.
   *     This method is used to build authed connection between dapp and wallet.
   *     In some wallets (Cosmos wallets in particular) the authorization may down to the level of chains/networks.
   *     To distinguish with `connect` method in ChainWallet, we make it `enable` here.
   */
  enable?(authRange: AuthRange, options?: unknown): Promise<void>;
  /**
   * 2: Get Account
   *     `address` especially required in returned value.
   *     `address` is the user identifier in BlockChain, directing to a public/private key pair.
   *     In Cosmos it's `Bech32Address`, which varies among chains/networks.
   *     In other ecosystem it could be public key and irrespective of chains/networks.
   */
  getAccounts(
    authRange: AuthRange,
    options?: unknown
  ): Promise<AddRaw<WalletAccount>[]>;
  /**
   * 3: Disable/Cancel Authorization
   *     Or called `disconnect` in some wallets.
   */
  disable?(authRange?: AuthRange, options?: unknown): Promise<void>;

  // --------------------------------------------------------------------------------------------------------------
  //                                                DOC RELATED
  // --------------------------------------------------------------------------------------------------------------

  /**
   * 1: Sign Doc
   *     Address in params is used to get the private key from wallet to sign doc.
   *     Return the signature.
   *     There can be multipule sign methods provided by wallet, i.e. signTransaction, signMessage, signDirect, signAmino etc.
   *     We collect them all in a single sign method and practice according to the type guards of doc.
   *     The simplest type guard example of doc is that if doc is of type `string` we'll use signMessage.
   *     Type guards can be different from wallets.
   *     Usually type guards function locates in type-guards.ts.
   *     Check the code in wallet package for detail.
   *
   * @param signer
   *     Signer could be the address or public key.
   * @param doc
   *     The type of doc can varies from different wallets and namespaces.
   *
   * @returns the signature
   */
  sign?(
    namespace: Namespace,
    chainId: string,
    signer: string,
    doc: unknown,
    options?: unknown
  ): Promise<AddRaw<Signature>>;
  /**
   * 2: Verify Doc
   *     To check the signature matches the signedDoc.
   *
   * @param signedDoc
   *     The type of signedDoc can varies from different wallets and namespaces.
   */
  verify?(
    namespace: Namespace,
    chainId: string,
    signer: string,
    signedDoc: unknown,
    signature: Signature,
    options?: unknown
  ): Promise<boolean>;
  /**
   * 3: Broadcast Signed Doc
   *     or called `execute/submit` in some wallets or networks
   *     address in params is used to get the public key from wallet to verify signedDoc.
   *     endpoint is the path to do verification and broadcast.
   *     return the new block.
   *
   * @param signedDoc
   *     The type of signedDoc can varies from different wallets and namespaces.
   */
  broadcast?(
    namespace: Namespace,
    chainId: string,
    signer: string,
    signedDoc: unknown,
    options?: unknown
  ): Promise<AddRaw<Block>>;
  /**
   * 4: Sign and Broadcast Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   *
   * @param doc
   *     The type of doc can varies from different wallets and namespaces.
   *     Please note that if the doc is of type string and be regarded as bytes string, the default encoding will be regrarded as `hex`.
   *     If you are prividing non-hex string, use EncodedString type instead.
   */
  signAndBroadcast?(
    namespace: Namespace,
    chainId: string,
    signer: string,
    doc: unknown,
    options?: unknown
  ): Promise<AddRaw<Block>>;
  // --------------------------------------------------------------------------------------------------------------

  /**
   * Add Chain
   *     If the target network/chain is not supported by the wallet, you can choose to register the target chain to
   *     the wallet before other actions.
   */
  addChain?(
    namespace: Namespace,
    chainInfo: unknown,
    options?: unknown
  ): Promise<void>;
  /**
   * Switch Chain
   *     Some wallets only supports interacting with one chain at a time. We call this the wallet’s “active chain”.
   *     This method enables dapps to request that the wallet switches its active chain to whichever one is required by the dapp,
   *     if the wallet has a concept thereof.
   */
  switchChain?(
    namespace: Namespace,
    chainId: string,
    options?: unknown
  ): Promise<void>;

  qrUrl?: Mutable<string>;
  appUrl?: Mutable<AppUrl>;

  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

export type WalletAdapter = ChainWalletBase | MainWalletBase;

export interface IChainWallet {
  new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}

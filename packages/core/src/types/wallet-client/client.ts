import { Mutable } from '../common';
import { AppUrl } from '../wallet';
import { Args, Options } from './args';
import { Resp } from './resp';

export type WalletClientMethod =
  | 'enable'
  | 'disable'
  | 'getAccount'
  | 'switchChain'
  | 'addChain'
  | 'sign'
  | 'verify'
  | 'broadcast'
  | 'signAndBroadcast';

export type WalletClientOptions = {
  [k in WalletClientMethod]?: Options;
} & {
  general?: Options;
};

/**
 * A standardized WalletCLient interface suitable for all kinds if networks
 */
export interface WalletClient {
  // --------------------------------------------------------------------------------------------------------------
  //                                                AUTH RELATED
  // --------------------------------------------------------------------------------------------------------------

  /**
   * 1. Enable/Authorize Connection
   *     Or called `onboard/requestAccount/connect` in some wallets.
   *     This method is used to build authed connection between dapp and wallet.
   *     In some wallets (Cosmos wallets in particular) the authorization may down to the level of chains/networks.
   *     To distinguish with `connect` method in ChainWallet, we make it `enable` here.
   */
  enable?(args: Args.AuthRelated[]): Promise<Resp.Void>;
  /**
   * 2. Disable/Cancel Authorization
   *     Or called `disconnect` in some wallets.
   */
  disable?(args?: Args.AuthRelated[]): Promise<Resp.Void>;

  // --------------------------------------------------------------------------------------------------------------
  //                                                   ACCOUNT ETC
  // --------------------------------------------------------------------------------------------------------------

  /**
   * Get Account
   *     `address` especially required in returned value.
   *     `address` is the user identifier in BlockChain, directing to a public/private key pair.
   *     In Cosmos it's `Bech32Address`, which varies among chains/networks.
   *     In other ecosystem it could be public key and irrespective of chains/networks.
   */
  getAccount(args: Args.GetAccount): Promise<Resp.GetAccount>;
  /**
   * Switch Chain
   *     Some wallets only supports interacting with one chain at a time. We call this the wallet’s “active chain”.
   *     This method enables dapps to request that the wallet switches its active chain to whichever one is required by the dapp,
   *     if the wallet has a concept thereof.
   */
  switchChain?(args: Args.SwitchChain): Promise<Resp.Void>;
  /**
   * Add Chain
   *     If the target network/chain is not supported by the wallet, you can choose to register the target chain to
   *     the wallet before other actions.
   */
  addChain?(args: Args.AddChain<unknown>): Promise<Resp.Void>;

  // --------------------------------------------------------------------------------------------------------------
  //                                                 DOC RELATED
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
   * @param params
   *     Usually include doc and other info like corresponding signer address for keypair.
   *     Type of signed doc can varies from different wallets and namespaces.
   */
  sign?(args: Args.DocRelated<unknown>): Promise<Resp.Sign>;
  /**
   * 2: Verify Doc
   *     To check the signature matches the signedDoc.
   *
   * @param params
   *     Usually include signed doc, signature and other info like corresponding signer address for keypair.
   *     Type of signed doc can varies from different wallets and namespaces.
   */
  verify?(args: Args.DocRelated<unknown>): Promise<Resp.Verify>;
  /**
   * 3: Broadcast Signed Doc
   *     or called `execute/submit` in some wallets or networks
   *     address in params is used to get the public key from wallet to verify signedDoc.
   *     endpoint is the path to do verification and broadcast.
   *     return the new block.
   *
   * @param params
   *     Usually include signed doc (useually bytes) and other info like corresponding address for keypair.
   *     Type of signed doc can varies from different wallets and namespaces.
   */
  broadcast?(args: Args.DocRelated<unknown>): Promise<Resp.Broadcast>;
  /**
   * 4: Sign and Broadcast Doc
   *     address in params is used to get the private key from wallet to sign doc.
   *     return the signature.
   *
   * @param params
   *     Usually include doc and other info like corresponding signer address for keypair.
   *     Type of signed doc can varies from different wallets and namespaces.
   */
  signAndBroadcast?(args: Args.DocRelated<unknown>): Promise<Resp.Broadcast>;
  // --------------------------------------------------------------------------------------------------------------

  qrUrl?: Mutable<string>;
  appUrl?: Mutable<AppUrl>;

  on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
  off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
}

import { Encoding } from '../common';

export type Namespace =
  | 'cosmos'
  | 'ethereum'
  | 'solana'
  | 'stellar'
  | 'tezos'
  | 'near'
  | 'xrpl'
  | 'everscale'
  | 'aptos'
  | 'sui';

export type EncodedAddress =
  | string
  | {
      value: string;
      encoding: Encoding | 'bech32';
    };

export interface PublicKeyObject {
  value: string;
  encoding?: Encoding;
  algo?: string; // digital key scheme algorithm
}

export type PublicKey = string | PublicKeyObject;

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

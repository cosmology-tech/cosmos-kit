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

export type KeyType =
  | 'Address'
  | 'Bech32Address'
  | 'PublicKey'
  | 'Secret20ViewingKey'
  | 'EnigmaPubKey'
  | 'EnigmaTxEncryptionKey';

export type Key =
  | string
  | {
      value: string;
      type: KeyType;
      encoding?: Encoding;
      algo?: string; // digital key scheme algorithm
    };

/**
 * At least address or publicKey should exist
 */
export interface WalletAccount {
  keys: Key[];
  /**
   * some contracts provides readable address/publicKey representation service, like domain for an ip.
   * `name` is unique like address/publicKey, different from `username` in some wallet
   */
  name?: string;
  namespace: Namespace;
  chainId?: string;
}

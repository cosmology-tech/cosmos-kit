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
  | 'address'
  | 'address/bech32'
  | 'public'
  | 'public/enigma'
  | 'public/enigmaTxEncryption'
  | 'public/secp256k1'
  | 'public/ed25519'
  | 'public/sr25519'
  | 'public/multisigThreshold'
  | 'viewing/secret20';

export type Key =
  | string
  | {
      value: string;
      type: KeyType;
      encoding?: Encoding;
    };

/**
 * At least address or publicKey should exist
 */
export interface WalletAccount {
  namespace: Namespace;
  keys: Key[];
  /**
   * some contracts provides readable address/publicKey representation service, like domain for an ip.
   * `name` is unique like address/publicKey, different from `username` in some wallet
   */
  username?: string;
  chainId?: string;
}

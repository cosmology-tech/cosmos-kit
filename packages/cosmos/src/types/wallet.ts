import { EncodedString, PublicKey, WalletAccount } from '@cosmos-kit/core';

export type Algo = 'secp256k1' | 'ed25519' | 'sr25519';

export interface CosmosWalletAccount extends WalletAccount {
  namespace: 'cosmos';
  chainId: string;
  username: string;
  /**
   * digital key scheme for creating digital signatures
   */
  algo: Algo;
  publicKey: PublicKey;
  rawAddress?: EncodedString;
  isLedger?: boolean;
}

import { Algo, EncodedString, WalletAccount } from '@cosmos-kit/core';

export interface CosmosWalletAccount extends WalletAccount {
  namespace: 'cosmos';
  chainId: string;
  username: string;
  /**
   * digital key scheme for creating digital signatures
   */
  algo: Algo;
  pubkey: EncodedString;
  rawAddress: EncodedString;
  isNanoLedger?: boolean;
}

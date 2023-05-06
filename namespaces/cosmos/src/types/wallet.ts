import { Algo } from '@cosmjs/amino';
import {
  EncodedString,
  PublicKey,
  SignResponse,
  WalletAccount,
} from '@cosmos-kit/core';

export interface CosmosPublicKey1 extends PublicKey {
  algo: Algo;
}

export interface CosmosPublicKey2 extends PublicKey {
  type: string;
}

export interface CosmosWalletAccount extends WalletAccount {
  namespace: 'cosmos';
  chainId: string;
  username: string;
  publicKey: CosmosPublicKey1;
  rawAddress?: EncodedString;
  isLedger?: boolean;
}

export interface CosmosSignature extends SignResponse {
  publicKey: CosmosPublicKey2;
}

import { Algo } from '@cosmjs/amino';
import {
  EncodedString,
  PublicKeyObject,
  WalletAccount,
  Resp,
} from '@cosmos-kit/core';

export interface CosmosPublicKey1 extends PublicKeyObject {
  algo: Algo;
}

export interface CosmosPublicKey2 extends PublicKeyObject {
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

export interface CosmosSignResp extends Resp.Sign {
  publicKey: CosmosPublicKey2;
}

import { Algo } from '@cosmjs/amino';
import { EncodedString, KeyN, WalletAccount, Resp } from '@cosmos-kit/core';

export interface CosmosPublicKey1 extends KeyN {
  algo: Algo;
}

export interface CosmosPublicKey2 extends KeyN {
  type: string;
}

export interface CosmosWalletAccount extends WalletAccount {
  namespace: 'cosmos';
  chainId: string;
  username: string;
  keys: CosmosPublicKey1;
  rawAddress?: EncodedString;
  isLedger?: boolean;
}

export interface CosmosSignResp extends Resp.Sign {
  publicKey: CosmosPublicKey2;
}

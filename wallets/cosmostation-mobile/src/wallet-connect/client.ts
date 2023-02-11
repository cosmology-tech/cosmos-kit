import { Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

export class CosmostationClient extends WCClient {
  constructor(walletInfo: Wallet) {
    super(walletInfo);
  }
}

import { Wallet } from '@cosmos-kit/core';
import { WCClient } from '@cosmos-kit/walletconnect';

export class OWalletClient extends WCClient {
  constructor(walletInfo: Wallet) {
    super(walletInfo);
  }
}

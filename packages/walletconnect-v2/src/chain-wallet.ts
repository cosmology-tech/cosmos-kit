import {
  ChainRecord,
  ChainWalletBase,
  Wallet,
  WalletConnectOptions,
} from '@cosmos-kit/core';

import { WCClientV2 } from './client';
import { IWCClientV2 } from './types';

export class ChainWCV2 extends ChainWalletBase {
  walletConnectOptions?: WalletConnectOptions | undefined;
  WCClient: IWCClientV2;
  client?: WCClientV2;
  protected options?: WalletConnectOptions | undefined;

  constructor(
    walletInfo: Wallet,
    chainInfo: ChainRecord,
    WCClient: IWCClientV2,
    options?: WalletConnectOptions
  ) {
    super(walletInfo, chainInfo);
    this.WCClient = WCClient;
    this.options = options;
  }

  get qrUrl(): string | undefined {
    return this.client?.qrUrl;
  }

  get appUrl(): string | undefined {
    return this.client?.appUrl;
  }

  setWalletConnectOptions(options: WalletConnectOptions | undefined): void {
    this.options = options;
  }
}

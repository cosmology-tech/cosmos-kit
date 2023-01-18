import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import { SignClientTypes } from '@walletconnect/types';

import { WCClientV2 } from './client';
import { IWCClientV2 } from './types';

export class ChainWCV2 extends ChainWalletBase {
  wcSignClientOptions?: SignClientTypes.Options | undefined;
  WCClient: IWCClientV2;
  client?: WCClientV2;

  constructor(
    walletInfo: Wallet,
    chainInfo: ChainRecord,
    WCClient: IWCClientV2
  ) {
    super(walletInfo, chainInfo);
    this.WCClient = WCClient;
  }

  get qrUrl(): string | undefined {
    return this.client?.qrUrl;
  }

  get appUrl(): string | undefined {
    return this.client?.appUrl;
  }
}

import {
  EndpointOptions,
  Wallet,
  WalletConnectOptions,
} from '@cosmos-kit/core';
import { KeplrClient as ExtensionKeplrClient } from '@cosmos-kit/keplr-extension';
import { WCWallet } from '@cosmos-kit/walletconnect';
import { Keplr } from '@keplr-wallet/provider-extension';

import { ChainKeplrMobile } from './chain-wallet';
import { KeplrClient } from './client';

export class KeplrMobileWallet extends WCWallet {
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints']
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    super(walletInfo, ChainKeplrMobile, KeplrClient);
    this.preferredEndpoints = preferredEndpoints;
  }

  async initClient(options?: WalletConnectOptions): Promise<void> {
    try {
      const keplr = await Keplr.getKeplr();
      const userAgent: string | undefined = window.navigator.userAgent;
      if (keplr && userAgent.includes('KeplrWalletMobile')) {
        this.initClientDone(
          keplr ? new ExtensionKeplrClient(keplr) : undefined
        );
      } else {
        await super.initClient(options);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Client Not Exist!') {
          await super.initClient(options);
          return;
        }

        this.initClientError(error);
      }
    }
  }
}

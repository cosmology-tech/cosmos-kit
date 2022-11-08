import WalletConnect from '@walletconnect/client';
import {
  IPushServerOptions,
  IWalletConnectOptions,
} from '@walletconnect/types';

import { OS } from '..';

export abstract class WalletConnectClient {
  readonly connector: WalletConnect;

  constructor(
    connectorOpts?: IWalletConnectOptions,
    pushServerOpts?: IPushServerOptions
  ) {
    this.connector = new WalletConnect(
      connectorOpts || {
        bridge: 'https://bridge.walletconnect.org',
      },
      pushServerOpts
    );
  }

  get qrUrl() {
    return this.connector.uri;
  }

  abstract getAppUrl(os: OS): string | undefined;
}

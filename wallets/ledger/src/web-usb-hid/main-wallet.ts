import { EndpointOptions, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { LedgerChianWallet } from './chain-wallet';
import { LedgerClient } from './client';
import { TransportType, getCosmosApp } from './utils';

export class LedgerMainWallet extends MainWalletBase {
  transportType: TransportType
  constructor(
    walletInfo: Wallet,
    preferredEndpoints?: EndpointOptions['endpoints'],
    transportType: TransportType = 'WebUSB'
  ) {
    super(walletInfo, LedgerChianWallet);
    this.preferredEndpoints = preferredEndpoints;
    this.transportType = transportType;
  }

  async initClient() {
    this.initingClient();
    try {
      const ledger = await getCosmosApp(this.transportType);
      this.initClientDone(ledger ? new LedgerClient(ledger): undefined);
    } catch (error) {
      this.logger?.error(error);
      this.initClientError(error);
    }
  }
}

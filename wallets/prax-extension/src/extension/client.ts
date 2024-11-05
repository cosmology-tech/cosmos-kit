import { WalletClient } from '@cosmos-kit/core';
import { bech32mAddress } from '@penumbra-zone/bech32m/penumbra';
import { PenumbraClient } from '@penumbra-zone/client';
import { ViewService } from '@penumbra-zone/protobuf';

export class PraxClient implements WalletClient {
  readonly client: PenumbraClient;

  constructor(client: PenumbraClient) {
    this.client = client;
  }

  /** Request the connection to Prax */
  async enable() {
    await this.client.connect();
  }

  /** Request the connection to Prax */
  async connect() {
    await this.client.connect();
  }

  /** Make Prax forget the connection to the connected origin */
  async disconnect() {
    await this.client.disconnect();
  }

  private async getAccountInfo(): Promise<{
    chainId: string;
    address: string;
  }> {
    const viewService = this.client.service(ViewService);

    const [appParameters, address] = await Promise.all([
      viewService.appParameters({}),
      viewService.ephemeralAddress({ addressIndex: { account: 0 } }),
    ]);

    if (!appParameters.parameters?.chainId || !address.address) {
      throw new Error('Account info not found');
    }

    return {
      chainId: appParameters.parameters.chainId,
      address: bech32mAddress(address.address),
    };
  }

  /** Get ephemeral Penumbra address and the chainId that is connected to Prax */
  async getSimpleAccount() {
    await this.enable();

    const { address, chainId } = await this.getAccountInfo();

    return {
      namespace: 'cosmos',
      chainId,
      address,
    };
  }

  /** Subscribe to Prax connection state change */
  on(
    type: 'penumbrastate',
    listener: EventListenerOrEventListenerObject
  ): void {
    this.client.provider.addEventListener(type, listener);
  }

  /** Unsubscribe from Prax connection state change */
  off(
    type: 'penumbrastate',
    listener: EventListenerOrEventListenerObject
  ): void {
    this.client.provider.removeEventListener(type, listener);
  }
}

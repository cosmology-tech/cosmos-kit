import { ChainName, ChainRegistry, Dispatch, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';

import { ChainWCKeplr } from './chain-wallet';
import { WCKeplrData } from './types';

export class WCKeplrWallet extends MainWalletBase<
  KeplrWalletConnectV1,
  WCKeplrData,
  ChainWCKeplr
> {
  protected _chains: Map<ChainName, ChainWCKeplr>;
  protected _client: KeplrWalletConnectV1;
  connector: WalletConnect;
  ee: EventEmitter;

  constructor(_concurrency?: number) {
    super(_concurrency);

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org'
    });

    this.connector.on("connect", (error) => {
      if (error) {
        throw error;
      }
      this.setClient(new KeplrWalletConnectV1(this.connector));
      this.ee.emit('update');
      this.emitModalOpen?.(false);
    });

    this._client = new KeplrWalletConnectV1(this.connector);
    this.ee = new EventEmitter();
  }

  get qrUri() {
    return this.connector.uri;
  }

  get client() {
    return this._client;
  }

  setClient(client: KeplrWalletConnectV1) {
    this._client = client;
  }

  private get emitModalOpen(): Dispatch<boolean> | undefined {
    return this.actions?.modalOpen;
  }

  protected setChains(supportedChains: ChainRegistry[]): void {
    this._chains = new Map(
      supportedChains.map((chainRegistry) => [
        chainRegistry.name,
        new ChainWCKeplr(chainRegistry, this),
      ])
    );
  }

  async connect(): Promise<void> {
    if (!this.connector.connected) {
      await this.connector.createSession();
      this.setData({
        qrUri: this.qrUri
      })
      console.log('%cmain-wallet.ts line:71 this.qrUri', 'color: #007acc;', this.qrUri);
    }
    this.ee.on('update', async () => {
      await this.update();
    })
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      const chainWallet = this.chains.get(chainName)!;
      await chainWallet.update();
      if (chainWallet.isError) {
        console.error(`chain ${chainName} connection failed!`);
      } else {
        this.setData({
          qrUri: this.qrUri,
          username: chainWallet.username!,
        });
        this.setState(State.Done);
        return;
      }
    }

    this.setState(State.Error);
    this.setMessage(`Failed to connect keplr via wallet connect.`);
  }
}
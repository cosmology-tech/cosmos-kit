import { ChainName, ChainRegistry, Dispatch, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';

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

  constructor(_concurrency?: number) {
    super(_concurrency);

    this.connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org'
    });

    this._client = new KeplrWalletConnectV1(this.connector);
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

      this.connector.on("connect", async (error, payload) => {
        if (error) {
          throw error;
        }
        this.setClient(new KeplrWalletConnectV1(this.connector));
        await this.update();
        this.emitModalOpen?.(false);
      });
      
      this.setData({
        qrUri: this.qrUri
      })
    } else {
      await this.update();
    }
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
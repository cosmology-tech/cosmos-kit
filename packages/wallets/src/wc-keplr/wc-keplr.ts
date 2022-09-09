import { ChainName, Dispatch, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';

import { ChainWCKeplr } from './chain';
import { WCKeplrData } from './types';
import { sendTx } from './utils';

export class WCKeplrWallet extends MainWalletBase<
  Keplr,
  WCKeplrData,
  ChainWCKeplr
> {
  protected _chains!: Map<ChainName, ChainWCKeplr>;

  constructor(_concurrency?: number) {
    super(_concurrency);
  }

  private get emitQrUri(): Dispatch<string | undefined> | undefined {
    return this.actions?.qrUri;
  }

  private get emitModalOpen(): Dispatch<boolean> | undefined {
    return this.actions?.modalOpen;
  }

  private async getWCKeplr(): Promise<Keplr> {
    let keplr: Keplr | undefined = undefined;

    const connector = new WalletConnect({
      bridge: 'https://bridge.walletconnect.org', // Required
      qrcodeModal: {
        open: (uri: string, cb: any) => {
          this.emitQrUri?.(uri);
        },
        close: () => {
          // this.emitQrUri?.(undefined);
          this.emitModalOpen?.(false);
        },
      },
      // qrcodeModal: new KeplrQRCodeModalV1()
    });

    // Check if connection is already established
    if (!connector.connected) {
      // create new session
      connector.createSession();

      return new Promise<Keplr>((resolve, reject) => {
        connector.on('connect', (error) => {
          if (error) {
            reject(error);
          } else {
            keplr = new KeplrWalletConnectV1(connector, {
              sendTx,
            });
            // this.emitModalOpen?.(false);
            resolve(keplr);
          }
        });
      });
    } else {
      keplr = new KeplrWalletConnectV1(connector, {
        sendTx,
      });
      return Promise.resolve(keplr);
    }
  }

  get client(): Promise<Keplr | undefined> {
    return (async () => {
      return await this.getWCKeplr();
    })();
  }

  setChains(supportedChains: ChainName[]): void {
    this._chains = new Map(
      supportedChains.map((chainName) => [
        chainName,
        new ChainWCKeplr(chainName, this),
      ])
    );
  }

  async update() {
    this.setState(State.Pending);
    for (const chainName of this.chainNames) {
      try {
        const chainWallet = this.chains.get(chainName)!;
        await chainWallet.update();
        this.setData({
          username: chainWallet.username!,
        });
        this.setState(State.Done);
        return;
      } catch (error) {
        console.error(`chain ${chainName}: ${(error as Error).message}`);
      }
    }
    this.setState(State.Error);
    this.setMessage(`Failed to connect keplr.`);
  }
}

export * from './chain';

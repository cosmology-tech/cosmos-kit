import { ChainWC } from './chain';
import { ChainName, State } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { WalletConnectData } from './types';
import WalletConnect from "@walletconnect/client";


export class WCWallet extends MainWalletBase<WalletConnect, WalletConnectData, ChainWC> {
    protected _chains!: Map<ChainName, ChainWC>;

    constructor() {
        super();
    };

    get emitQrUri() {
        return this.actions?.qrUri;
    }

    get client() {
        const connector = new WalletConnect({
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: {
                open: (uri: string, cb: any) => {
                    this.emitQrUri?.(uri);
                },
                close: () => {
                    this.emitQrUri?.(undefined);
                },
            },
        });

        return connector;

        // Check if connection is already established
        // if (!connector.connected) {
        //     // create new session
        //     connector.createSession();

        //     return new Promise<Keplr>((resolve, reject) => {
        //         connector.on("connect", (error) => {
        //             if (error) {
        //                 reject(error);
        //             } else {
        //                 keplr = new KeplrWalletConnectV1(connector, {
        //                     sendTx,
        //                 });
        //                 resolve(keplr);
        //             }
        //         });
        //     });
        // }else {
        //     keplr = new KeplrWalletConnectV1(connector, {
        //       sendTx,
        //     });
        //     return Promise.resolve(keplr);
        //   }
    }

    get state() {
        return this.mutable.state
        if (this.client.connected) {
            return State.Done;
        } else if (this.client.pending) {
            return State.Pending;
        } else {
            return this.mutable.state;
        }
    }

    setChains(supportedChains: ChainName[]): void {
        this._chains = new Map(supportedChains.map(
            (chainName) => [
                chainName,
                new ChainWC(chainName, this)
            ]
        ));
    }

    async update() {
        this.setState(State.Pending);
        try {
            console.log(1, this.client.uri)
            if (!this.client.connected) {
                this.client.createSession();
            }
            console.log(2, this.client.uri)
            this.setData({
                username: this.client.accounts[0]!
            });
            this.setState(State.Done);
        } catch (error) {
            this.setState(State.Error);
            console.error(`Fail to update Wallet Connect.`);
        }
        // for (const chainName of this.chainNames) {
        //     try {
        //         const chainWallet = this.chains.get(chainName)!;
        //         await chainWallet.update();
        //         this.setData({
        //             username: chainWallet.username!
        //         }, emitData);
        //         this.setState(State.Done, emitState);
        //         return;
        //     } catch (error) {
        //         console.error(`chain ${chainName}: ${(error as Error).message}`)
        //     }
        // }
        // this.setState(State.Error, emitState);
        // console.error(`Fail to update any chain.`);
    }
};

export * from './chain';
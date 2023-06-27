import { I as IWCClient, a as IChainWC } from './chain-wallet-00b85231.js';
import { WCClient } from './client.js';
import { MainWalletBase, Mutable, Wallet, WalletConnectOptions } from '@cosmos-kit/core';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/sign-client';
import '@walletconnect/types';
import 'events';

declare class WCWallet extends MainWalletBase {
    WCClient: IWCClient;
    clientMutable: Mutable<WCClient>;
    constructor(walletInfo: Wallet, ChainWC: IChainWC, WCClient: IWCClient);
    initClient(options?: WalletConnectOptions): Promise<void>;
}

export { WCWallet };

import { Wallet, ChainRecord, ChainWalletBase, Mutable, WalletConnectOptions } from '@cosmos-kit/core';
import { WCClient } from './client.js';
import { StdSignature } from '@cosmjs/amino';

interface IChainWC {
    new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWC;
}
interface IWCClient {
    new (walletInfo: Wallet): WCClient;
}
interface WCDirectSignDoc {
    chainId: string;
    accountNumber: string;
    authInfoBytes: string;
    bodyBytes: string;
}
interface WCSignDirectRequest {
    signerAddress: string;
    signDoc: WCDirectSignDoc;
}
interface WCSignDirectResponse {
    signature: StdSignature;
    signed: WCDirectSignDoc;
}
interface WCAccount {
    address: string;
    algo: string;
    pubkey: string;
}

declare class ChainWC extends ChainWalletBase {
    WCClient: IWCClient;
    clientMutable: Mutable<WCClient>;
    options?: WalletConnectOptions;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord, WCClient: IWCClient);
    setClientNotExist(): void;
}

export { ChainWC as C, IWCClient as I, WCDirectSignDoc as W, IChainWC as a, WCSignDirectRequest as b, WCSignDirectResponse as c, WCAccount as d };

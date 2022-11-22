/// <reference types="node" />
import EventEmitter from 'events';
import { ChainRecord, ChainWalletBase, Wallet, WalletConnectClient } from '..';
export declare class ChainWalletConnect extends ChainWalletBase {
    client?: WalletConnectClient;
    emitter?: EventEmitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get connector(): import("@walletconnect/types").IConnector;
    get qrUrl(): string;
    get appUrl(): string;
}

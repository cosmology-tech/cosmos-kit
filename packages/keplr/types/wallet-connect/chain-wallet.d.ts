/// <reference types="node" />
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { KeplrClient } from '../client';
export declare class ChainKeplrMobile extends ChainWalletBase {
    client?: KeplrClient;
    connector?: WalletConnect;
    emitter?: EventEmitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get qrUri(): string;
    get appUrl(): string;
}

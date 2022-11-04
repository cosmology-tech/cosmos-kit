/// <reference types="node" />
import { ChainRecord, ChainWalletBase, Wallet } from '@cosmos-kit/core';
import WalletConnect from '@walletconnect/client';
import EventEmitter from 'events';
import { CosmostationClient } from '../client';
export declare class ChainCosmostationMobile extends ChainWalletBase {
    client?: CosmostationClient;
    connector?: WalletConnect;
    emitter?: EventEmitter;
    constructor(walletInfo: Wallet, chainInfo: ChainRecord);
    get qrUri(): string;
    get appUrl(): string;
}

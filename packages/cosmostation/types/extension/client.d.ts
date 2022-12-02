import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainRecord, WalletClient } from '@cosmos-kit/core';
import { Cosmostation } from './types';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmostation;
    private eventMap;
    constructor(client: Cosmostation);
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        pubkey: Uint8Array;
    }>;
    on(type: string, listener: EventListenerOrEventListenerObject): void;
    off(type: string, listener: EventListenerOrEventListenerObject): void;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
    addChain(chainInfo: ChainRecord): Promise<void>;
}

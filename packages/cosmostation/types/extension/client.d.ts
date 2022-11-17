import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainRecord, WalletClient } from '@cosmos-kit/core';
import { Cosmostation } from './types';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmostation;
    constructor(client: Cosmostation);
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
    addChain(chainInfo: ChainRecord): Promise<void>;
}

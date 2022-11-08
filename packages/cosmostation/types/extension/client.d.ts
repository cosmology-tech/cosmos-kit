import { OfflineSigner } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import { Cosmos } from '@cosmostation/extension-client';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmos;
    constructor(client: Cosmos);
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
}

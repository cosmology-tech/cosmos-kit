import { WalletClient } from '@cosmos-kit/core';
import { Extension } from '@terra-money/terra.js';
export declare class TerrastationClient implements WalletClient {
    readonly client: Extension;
    private addresses?;
    private emitter;
    constructor(client: Extension);
    private getPromiseFromEvent;
    connect(chainIds: string | string[]): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
    }>;
}

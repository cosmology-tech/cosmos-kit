import { ChainRecord, WalletClient } from '@cosmos-kit/core';
import type { Vectis } from './types';
export declare class VectisClient implements WalletClient {
    readonly client: Vectis;
    constructor(client: Vectis);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<import("@vectis/extension-client/types").KeyInfo>;
    getOfflineSigner(chainId: string): import("@cosmjs/proto-signing").OfflineSigner;
    addChain({ chain, name, preferredEndpoints }: ChainRecord): Promise<void>;
}

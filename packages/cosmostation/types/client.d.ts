import { OfflineSigner } from '@cosmjs/proto-signing';
import { WalletClient, WalletMode } from '@cosmos-kit/core';
import { Cosmos } from '@cosmostation/extension-client';
import { Keplr } from '@keplr-wallet/types';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmos | Keplr;
    readonly mode: WalletMode;
    constructor(client: Cosmos | Keplr, mode: WalletMode);
    getAccount(chainId: string): Promise<{
        name: any;
        address: any;
    }>;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
}

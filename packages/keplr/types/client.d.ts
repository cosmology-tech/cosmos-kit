import { ChainRecord, WalletClient, WalletMode } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
export declare class KeplrClient implements WalletClient {
    readonly client: Keplr;
    readonly mode: WalletMode;
    constructor(client: Keplr, mode: WalletMode);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
    }>;
    getOfflineSigner(chainId: string): import("@keplr-wallet/types").OfflineAminoSigner & import("@keplr-wallet/types").OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
}

import { Algo } from '@cosmjs/proto-signing';
import { ChainRecord, WalletClient } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
export declare class KeplrClient implements WalletClient {
    readonly client: Keplr;
    constructor(client: Keplr);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): import("@keplr-wallet/types").OfflineAminoSigner & import("@keplr-wallet/types").OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
}

import { Algo } from '@cosmjs/proto-signing';
import { SignType, WalletClient } from '@cosmos-kit/core';
import { Trust } from './types';
export declare class TrustClient implements WalletClient {
    readonly client: Trust;
    constructor(client: Trust);
    enable(chainIds: string | string[]): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string): Promise<{
        username: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): import("@cosmjs/proto-signing").OfflineSigner & import("@cosmjs/proto-signing").OfflineDirectSigner;
}

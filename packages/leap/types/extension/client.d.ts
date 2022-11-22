import { Algo } from '@cosmjs/proto-signing';
import { WalletClient } from '@cosmos-kit/core';
import { Leap } from './types';
export declare class LeapClient implements WalletClient {
    readonly client: Leap;
    constructor(client: Leap);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string): import("@cosmjs/proto-signing").OfflineSigner & import("@cosmjs/proto-signing").OfflineDirectSigner;
}

import { WalletClient, WalletMode } from '@cosmos-kit/core';
import { Leap } from './extension/types';
export declare class LeapClient implements WalletClient {
    readonly client: Leap;
    readonly mode: WalletMode;
    constructor(client: Leap, mode: WalletMode);
    enable(chainIds: string | string[]): Promise<void>;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
    }>;
    getOfflineSigner(chainId: string): import("@cosmjs/proto-signing").OfflineSigner & import("@cosmjs/proto-signing").OfflineDirectSigner;
}

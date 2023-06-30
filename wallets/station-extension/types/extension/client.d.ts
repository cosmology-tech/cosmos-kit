import { WalletClient, WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension';
import { OfflineSigner } from './signer';
export declare class StationClient implements WalletClient {
    readonly client: StationExtension;
    constructor(client: StationExtension);
    disconnect(): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
    }>;
    getAccount(chainId: string): Promise<WalletAccount>;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
}

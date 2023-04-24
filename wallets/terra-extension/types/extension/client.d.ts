import { WalletClient, WalletAccount } from '@cosmos-kit/core';
import { TerraExtension } from './extension';
import { OfflineSigner } from './signer';
export declare class TerraClient implements WalletClient {
    readonly client: TerraExtension;
    constructor(client: TerraExtension);
    disconnect(): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
    }>;
    getAccount(chainId: string): Promise<WalletAccount>;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
}

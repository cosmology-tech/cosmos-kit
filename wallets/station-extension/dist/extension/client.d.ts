import { WalletClient, WalletAccount } from '@cosmos-kit/core';
import { StationExtension } from './extension.js';
import { OfflineSigner } from './signer.js';
import '@terra-money/feather.js';
import './types.js';
import '@cosmjs/proto-signing';
import '@cosmjs/amino';

declare class StationClient implements WalletClient {
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

export { StationClient };

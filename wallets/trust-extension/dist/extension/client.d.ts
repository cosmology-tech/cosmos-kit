import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { Algo } from '@cosmjs/proto-signing';
import { WalletClient, SignType } from '@cosmos-kit/core';
import { Trust } from './types.js';
import '@cosmjs/amino';
import '@keplr-wallet/types';

declare class TrustClient implements WalletClient {
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
    getOfflineSigner(chainId: string, preferredSignType?: SignType): _cosmjs_proto_signing.OfflineSigner & _cosmjs_proto_signing.OfflineDirectSigner;
}

export { TrustClient };

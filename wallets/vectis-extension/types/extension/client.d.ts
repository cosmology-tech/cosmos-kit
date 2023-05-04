import { Algo, StdSignDoc } from '@cosmjs/amino';
import { ChainRecord, DirectSignDoc, SignOptions, SignType, WalletClient } from '@cosmos-kit/core';
import type { Vectis } from './types';
export declare class VectisClient implements WalletClient {
    readonly client: Vectis;
    constructor(client: Vectis);
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
        isNanoLedger: boolean;
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): Promise<import("@cosmjs/amino").OfflineAminoSigner | import("@cosmjs/proto-signing").OfflineDirectSigner>;
    getOfflineSignerAmino(chainId: string): import("@cosmjs/amino").OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): import("@cosmjs/proto-signing").OfflineDirectSigner;
    addChain({ chain, name, preferredEndpoints }: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<import("@cosmjs/amino").AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<import("@cosmjs/proto-signing").DirectSignResponse>;
}

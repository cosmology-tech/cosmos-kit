import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import * as _cosmjs_amino from '@cosmjs/amino';
import { StdSignDoc, StdSignature } from '@cosmjs/amino';
import { WalletClient, SignType, SignOptions, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
import { Frontier } from './types.js';

declare class FrontierClient implements WalletClient {
    readonly client: Frontier;
    constructor(client: Frontier);
    enable(chainIds: string | string[]): Promise<void>;
    disconnect(): Promise<void>;
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
    getOfflineSigner(chainId: string, preferredSignType?: SignType): _cosmjs_amino.OfflineAminoSigner | OfflineDirectSigner;
    getOfflineSignerAmino(chainId: string): _cosmjs_amino.OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<_cosmjs_amino.AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<_cosmjs_proto_signing.DirectSignResponse>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { FrontierClient };

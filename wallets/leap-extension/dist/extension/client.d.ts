import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { Algo, OfflineDirectSigner } from '@cosmjs/proto-signing';
import * as _cosmjs_amino from '@cosmjs/amino';
import { StdSignDoc, StdSignature } from '@cosmjs/amino';
import { WalletClient, SuggestToken, ChainRecord, SignType, SignOptions, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';
import { Leap } from './types.js';
import '@keplr-wallet/types';

declare class LeapClient implements WalletClient {
    readonly client: Leap;
    constructor(client: Leap);
    enable(chainIds: string | string[]): Promise<void>;
    suggestToken({ chainId, tokens, type }: SuggestToken): Promise<void>;
    addChain(chainInfo: ChainRecord): Promise<void>;
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
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<_cosmjs_proto_signing.DirectSignResponse>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { LeapClient };

import * as _cosmjs_proto_signing from '@cosmjs/proto-signing';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import * as _keplr_wallet_types from '@keplr-wallet/types';
import { Cosmostation, Cosmos } from './types.js';
import { StdSignDoc, StdSignature } from '@cosmjs/amino';
import { WalletClient, SuggestToken, SignType, ChainRecord, SignOptions, DirectSignDoc, BroadcastMode } from '@cosmos-kit/core';

declare class CosmostationClient implements WalletClient {
    readonly client: Cosmostation;
    private eventMap;
    constructor(client: Cosmostation);
    get cosmos(): Cosmos;
    get ikeplr(): _keplr_wallet_types.Keplr;
    suggestToken({ chainName, tokens, type }: SuggestToken): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string): Promise<{
        username: string;
        address: string;
        pubkey: Uint8Array;
        algo: _cosmjs_proto_signing.Algo;
    }>;
    disconnect(): Promise<void>;
    on(type: string, listener: EventListenerOrEventListenerObject): void;
    off(type: string, listener: EventListenerOrEventListenerObject): void;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineDirectSigner | _keplr_wallet_types.OfflineAminoSigner;
    getOfflineSignerAmino(chainId: string): _keplr_wallet_types.OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<any>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

export { CosmostationClient };

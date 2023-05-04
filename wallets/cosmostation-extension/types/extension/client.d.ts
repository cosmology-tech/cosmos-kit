import { StdSignDoc } from '@cosmjs/amino';
import { OfflineDirectSigner } from '@cosmjs/proto-signing';
import { BroadcastMode, ChainRecord, DirectSignDoc, SignOptions, SignType, SuggestToken, WalletClient } from '@cosmos-kit/core';
import { Cosmostation } from './types';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmostation;
    private eventMap;
    constructor(client: Cosmostation);
    get cosmos(): import("./types").Cosmos;
    get ikeplr(): import("@keplr-wallet/types").Keplr;
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
        algo: import("@cosmjs/proto-signing").Algo;
    }>;
    disconnect(): Promise<void>;
    on(type: string, listener: EventListenerOrEventListenerObject): void;
    off(type: string, listener: EventListenerOrEventListenerObject): void;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineDirectSigner | import("@keplr-wallet/types").OfflineAminoSigner;
    getOfflineSignerAmino(chainId: string): import("@keplr-wallet/types").OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<any>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

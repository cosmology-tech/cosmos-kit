import { StdSignDoc } from '@cosmjs/amino';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { BroadcastMode, ChainRecord, DirectSignDoc, SignOptions, WalletClient } from '@cosmos-kit/core';
import { Cosmostation } from './types';
export declare class CosmostationClient implements WalletClient {
    readonly client: Cosmostation;
    private eventMap;
    constructor(client: Cosmostation);
    get cosmos(): import("./types").Cosmos;
    get keplr(): import("@keplr-wallet/types").Keplr;
    getAccount(chainId: string): Promise<{
        name: string;
        address: string;
        pubkey: Uint8Array;
    }>;
    disconnect(): Promise<void>;
    on(type: string, listener: EventListenerOrEventListenerObject): void;
    off(type: string, listener: EventListenerOrEventListenerObject): void;
    getOfflineSigner(chainId: string): Promise<OfflineSigner>;
    addChain(chainInfo: ChainRecord): Promise<void>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<any>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<any>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}

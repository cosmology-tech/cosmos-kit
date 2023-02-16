/// <reference types="node" />
/// <reference types="node" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { DirectSignDoc, Logger, Mutable, SignOptions, State, Wallet, WalletAccount, WalletClient, WalletClientActions, WalletConnectOptions } from '@cosmos-kit/core';
import SignClient from '@walletconnect/sign-client';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import EventEmitter from 'events';
declare type Namespace = string;
declare type ChainId = string;
declare type Address = string;
export declare class WCClient implements WalletClient {
    readonly walletInfo: Wallet;
    walletProjectId: string;
    walletWCName: string;
    signClient?: SignClient;
    wcWalletInfo?: any;
    actions?: WalletClientActions;
    qrUrl: Mutable<string>;
    appUrl: Mutable<string>;
    pairings?: PairingTypes.Struct[];
    session?: SessionTypes.Struct;
    emitter: EventEmitter;
    logger?: Logger;
    options?: WalletConnectOptions;
    relayUrl?: string;
    constructor(walletInfo: Wallet);
    get accounts(): [Namespace, ChainId, Address][];
    reset(): void;
    subscribeToEvents(): void;
    deleteInactivePairings(): Promise<void>;
    restorePairings(): void;
    get pairing(): PairingTypes.Struct | undefined;
    restoreSession(): void;
    get walletName(): string;
    get dappProjectId(): string;
    fetchWCWalletInfo(): Promise<void>;
    setActions(actions: WalletClientActions): void;
    setQRState(state: State): void;
    setQRError(e?: Error | string): void;
    initSignClient(): Promise<void>;
    connect(chainIds: string | string[], isMobile: boolean): Promise<void>;
    getAppUrl(): Promise<string | undefined>;
    disconnect(): Promise<void>;
    getAccount(chainId: string): Promise<WalletAccount>;
    getKey(chainId: string): Promise<{
        address: string;
        algo: import("@cosmjs/amino").Algo;
        pubkey: Buffer;
    }>;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): OfflineDirectSigner;
    getOfflineSigner(chainId: string): Promise<OfflineDirectSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions): Promise<DirectSignResponse>;
}
export {};

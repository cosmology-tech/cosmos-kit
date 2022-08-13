/// <reference types="long" />
import { AminoSignResponse, BroadcastMode, OfflineSigner, StdSignature, StdSignDoc, StdTx } from '@cosmjs/launchpad';
import { DirectSignResponse, OfflineDirectSigner } from '@cosmjs/proto-signing';
import { KVStore } from '@keplr-wallet/common';
import { ChainInfo, KeplrIntereactionOptions, KeplrMode, KeplrSignOptions, Key } from '@keplr-wallet/types';
import { IConnector, IJsonRpcRequest, IRequestOptions } from '@walletconnect/types';
import { SecretUtils } from 'secretjs/types/enigmautils';
import { IKeplrWalletConnectV1 } from '../types';
export declare type KeplrGetKeyWalletConnectV1Response = {
    address: string;
    algo: string;
    bech32Address: string;
    isNanoLedger: boolean;
    name: string;
    pubKey: string;
};
export declare type KeplrKeystoreMayChangedEventParam = {
    algo: string;
    name: string;
    isNanoLedger: boolean;
    keys: {
        chainIdentifier: string;
        address: string;
        bech32Address: string;
        pubKey: string;
    }[];
};
export declare class KeplrWalletConnectV1 implements IKeplrWalletConnectV1 {
    kvStore: KVStore;
    onBeforeSendRequest?: (request: Partial<IJsonRpcRequest>, options?: IRequestOptions) => Promise<void> | void;
    onAfterSendRequest?: (response: unknown, request: Partial<IJsonRpcRequest>, options?: IRequestOptions) => Promise<void> | void;
    dontOpenAppOnEnable: boolean;
    readonly connector: IConnector;
    readonly chainInfos: ChainInfo[];
    constructor(connector: IConnector, chainInfos: ChainInfo[], options?: {
        kvStore?: KVStore;
        onBeforeSendRequest?: KeplrWalletConnectV1['onBeforeSendRequest'];
        onAfterSendRequest?: KeplrWalletConnectV1['onAfterSendRequest'];
    });
    readonly version: string;
    readonly mode: KeplrMode;
    defaultOptions: KeplrIntereactionOptions;
    protected readonly onCallReqeust: (error: Error | null, payload: any | null) => Promise<void>;
    protected clearSaved(): Promise<void>;
    protected sendCustomRequest(request: Partial<IJsonRpcRequest>, options?: IRequestOptions): Promise<unknown>;
    enable(chainIds: string | string[]): Promise<void>;
    protected getKeyHasEnabled(): string;
    protected getHasEnabledChainIds(): Promise<string[]>;
    protected saveHasEnabledChainIds(chainIds: string[]): Promise<void>;
    enigmaDecrypt(_chainId: string, _ciphertext: Uint8Array, _nonce: Uint8Array): Promise<Uint8Array>;
    enigmaEncrypt(_chainId: string, _contractCodeHash: string, _msg: object): Promise<Uint8Array>;
    experimentalSuggestChain(_chainInfo: ChainInfo): Promise<void>;
    getEnigmaPubKey(_chainId: string): Promise<Uint8Array>;
    getEnigmaTxEncryptionKey(_chainId: string, _nonce: Uint8Array): Promise<Uint8Array>;
    getEnigmaUtils(_chainId: string): SecretUtils;
    getKey(chainId: string): Promise<Key>;
    protected getKeyLastSeenKey(): string;
    protected getLastSeenKey(chainId: string): Promise<KeplrGetKeyWalletConnectV1Response | undefined>;
    protected getAllLastSeenKey(): Promise<{
        [chainId: string]: KeplrGetKeyWalletConnectV1Response;
    }>;
    protected saveAllLastSeenKey(data: {
        [chainId: string]: KeplrGetKeyWalletConnectV1Response | undefined;
    }): Promise<void>;
    protected saveLastSeenKey(chainId: string, response: KeplrGetKeyWalletConnectV1Response): Promise<void>;
    signArbitrary(_chainId: string, _signer: string, _data: string | Uint8Array): Promise<StdSignature>;
    verifyArbitrary(_chainId: string, _signer: string, _data: string | Uint8Array, _signature: StdSignature): Promise<boolean>;
    getOfflineSigner(chainId: string): OfflineSigner & OfflineDirectSigner;
    getOfflineSignerAuto(chainId: string): Promise<OfflineSigner | OfflineDirectSigner>;
    getOfflineSignerOnlyAmino(chainId: string): OfflineSigner;
    getSecret20ViewingKey(_chainId: string, _contractAddress: string): Promise<string>;
    sendTx(chainId: string, tx: StdTx | Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: KeplrSignOptions): Promise<AminoSignResponse>;
    signDirect(_chainId: string, _signer: string, _signDoc: {
        bodyBytes?: Uint8Array | null;
        authInfoBytes?: Uint8Array | null;
        chainId?: string | null;
        accountNumber?: Long | null;
    }, _signOptions?: KeplrSignOptions): Promise<DirectSignResponse>;
    suggestToken(_chainId: string, _contractAddress: string, _viewingKey?: string): Promise<void>;
}

/// <reference types="react" />
/// <reference types="node" />
/// <reference types="long" />
import { AccountData, AminoSignResponse, OfflineAminoSigner, StdSignature, StdSignDoc } from '@cosmjs/amino';
import { DirectSignResponse, OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { SignClientTypes } from '@walletconnect/types';
import { ChainWalletBase, MainWalletBase } from '../bases';
import { ChainName, ChainRecord } from './chain';
import { DappEnv, Mutable, OS, SignType } from './common';
export interface Key {
    readonly name: string;
    readonly algo: string;
    readonly pubKey: Uint8Array;
    readonly address: Uint8Array;
    readonly bech32Address: string;
    readonly isNanoLedger: boolean;
    readonly isSmartContract?: boolean;
}
export interface SimpleAccount {
    namespace: string;
    chainId: string;
    address: string;
    username?: string;
}
export declare type WalletName = string;
export declare enum WalletStatus {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    NotExist = "NotExist",
    Rejected = "Rejected",
    Error = "Error"
}
export interface DownloadInfo extends DappEnv {
    icon?: string | ((props: any) => JSX.Element);
    link: string;
}
export declare type WalletMode = 'extension' | 'wallet-connect';
export interface Metadata {
    name: string;
    description: string;
    url: string;
    icons: string[];
}
export interface AppUrl {
    native?: string | {
        android?: string;
        ios?: string;
        macos?: string;
        windows?: string;
    };
    universal?: string;
}
export interface Wallet {
    name: WalletName;
    prettyName: string;
    mode: WalletMode;
    mobileDisabled: boolean;
    rejectMessage?: {
        source: string;
        target?: string;
    } | string;
    rejectCode?: number;
    connectEventNamesOnWindow?: string[];
    connectEventNamesOnClient?: string[];
    downloads?: DownloadInfo[];
    logo?: string;
    walletconnect?: {
        name: string;
        projectId: string;
        encoding?: BufferEncoding;
        mobile?: AppUrl;
        formatNativeUrl?: (appUrl: string, wcUri: string, os: OS | undefined, name: string) => string;
        formatUniversalUrl?: (appUrl: string, wcUri: string, name: string) => string;
    };
}
export declare type Bech32Address = string;
export interface WalletAccount extends AccountData {
    username?: string;
    isNanoLedger?: boolean;
    isSmartContract?: boolean;
}
export interface SignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
export interface DirectSignDoc {
    /** SignDoc bodyBytes */
    bodyBytes?: Uint8Array | null;
    /** SignDoc authInfoBytes */
    authInfoBytes?: Uint8Array | null;
    /** SignDoc chainId */
    chainId?: string | null;
    /** SignDoc accountNumber */
    accountNumber?: Long | null;
}
export declare enum BroadcastMode {
    /** Return after tx commit */
    Block = "block",
    /** Return after CheckTx */
    Sync = "sync",
    /** Return right away */
    Async = "async"
}
export interface SuggestCW20Token {
    contractAddress: string;
    viewingKey?: string;
    imageURL?: string;
    coinGeckoId?: string;
}
export declare const SuggestTokenTypes: {
    readonly CW20: "cw20";
    readonly ERC20: "erc20";
};
export declare type SuggestTokenType = typeof SuggestTokenTypes[keyof typeof SuggestTokenTypes];
export interface SuggestToken {
    chainId: string;
    chainName: string;
    type: SuggestTokenType;
    tokens: SuggestCW20Token[];
}
export interface WalletClient {
    getSimpleAccount: (chainId: string) => Promise<SimpleAccount>;
    qrUrl?: Mutable<string>;
    appUrl?: Mutable<AppUrl>;
    connect?: (chainIds: string | string[]) => Promise<void>;
    disconnect?: () => Promise<void>;
    on?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    off?: (type: string, listener: EventListenerOrEventListenerObject) => void;
    enable?: (chainIds: string | string[]) => Promise<void>;
    suggestToken?: (data: SuggestToken) => Promise<void>;
    addChain?: (chainInfo: ChainRecord) => Promise<void>;
    getAccount?: (chainId: string) => Promise<WalletAccount>;
    getOfflineSigner?: (chainId: string, preferredSignType?: SignType) => Promise<OfflineSigner> | OfflineSigner;
    getOfflineSignerAmino?: (chainId: string) => OfflineAminoSigner;
    getOfflineSignerDirect?: (chainId: string) => OfflineDirectSigner;
    signAmino?: (chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions) => Promise<AminoSignResponse>;
    signDirect?: (chainId: string, signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions) => Promise<DirectSignResponse>;
    signArbitrary?: (chainId: string, signer: string, data: string | Uint8Array) => Promise<StdSignature>;
    getEnigmaPubKey?: (chainId: string) => Promise<Uint8Array>;
    getEnigmaTxEncryptionKey?: (chainId: string, nonce: Uint8Array) => Promise<Uint8Array>;
    enigmaEncrypt?: (chainId: string, contractCodeHash: string, msg: object) => Promise<Uint8Array>;
    enigmaDecrypt?: (chainId: string, ciphertext: Uint8Array, nonce: Uint8Array) => Promise<Uint8Array>;
    sendTx?: (chainId: string, tx: Uint8Array, mode: BroadcastMode) => Promise<Uint8Array>;
}
export declare type WalletAdapter = ChainWalletBase | MainWalletBase;
export interface IChainWallet {
    new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}
export declare type NameServiceName = string;
export interface NameServiceRegistry {
    name: NameServiceName;
    contract: string;
    chainName: ChainName;
    getQueryMsg: (address: Bech32Address) => any;
    slip173: string;
}
export interface WalletConnectOptions {
    signClient: {
        projectId: string;
    } & SignClientTypes.Options;
}

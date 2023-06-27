import * as _chain_registry_types from '@chain-registry/types';
import { Chain, AssetList } from '@chain-registry/types';
import { CosmWasmClient, SigningCosmWasmClientOptions, SigningCosmWasmClient, HttpEndpoint } from '@cosmjs/cosmwasm-stargate';
import * as _cosmjs_stargate from '@cosmjs/stargate';
import { StargateClientOptions, SigningStargateClientOptions, StargateClient, SigningStargateClient, StdFee } from '@cosmjs/stargate';
import { Mutable, Data, StateActions, DappEnv, Actions, State, Callbacks, SignType, CosmosClientType, OS, Dispatch } from './types/common.js';
import { AccountData, OfflineAminoSigner, StdSignDoc, AminoSignResponse, StdSignature } from '@cosmjs/amino';
import { OfflineSigner, EncodeObject, OfflineDirectSigner, DirectSignResponse } from '@cosmjs/proto-signing';
import { SignClientTypes } from '@walletconnect/types';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Logger } from './utils/logger.js';
import EventEmitter from 'events';

declare class NameService {
    client: CosmWasmClient;
    registry: NameServiceRegistry;
    constructor(client: CosmWasmClient, registry: NameServiceRegistry);
    resolveName(address: Bech32Address): Promise<any | undefined>;
}

declare class Session {
    sessionOptions: SessionOptions;
    timeoutId?: string | number | NodeJS.Timeout;
    constructor(sessionOptions: SessionOptions);
    update(): void;
}

declare class StateBase {
    protected _mutable: Mutable<Data>;
    actions?: StateActions<Data>;
    protected _env?: DappEnv;
    logger?: Logger;
    constructor();
    get env(): DappEnv;
    setEnv(env?: DappEnv): void;
    setActions: (actions: Actions) => void;
    get isMobile(): boolean;
    get mutable(): Mutable<Data>;
    get state(): State;
    get isInit(): boolean;
    get isDone(): boolean;
    get isError(): boolean;
    get isPending(): boolean;
    get data(): Data;
    get message(): string;
    setState(state: State): void;
    setData(data: Data | undefined): void;
    setMessage(message: string | undefined): void;
    reset(): void;
    get walletStatus(): WalletStatus;
    get isWalletOnceConnect(): boolean;
    get isWalletConnecting(): boolean;
    get isWalletConnected(): boolean;
    get isWalletDisconnected(): boolean;
    get isWalletRejected(): boolean;
    get isWalletNotExist(): boolean;
    get isWalletError(): boolean;
}

declare abstract class WalletBase extends StateBase {
    clientMutable: Mutable<WalletClient>;
    emitter?: EventEmitter;
    protected _walletInfo: Wallet;
    callbacks?: Callbacks;
    session?: Session;
    walletConnectOptions?: WalletConnectOptions;
    /**
     * isActive in mainWallet is not like chainWallet
     * - mainWallet: activated when connected
     * - chainWallet: activated when called by hooks (useChain, useChainWallet etc)
     */
    isActive: boolean;
    throwErrors: boolean;
    constructor(walletInfo: Wallet);
    get appUrl(): Mutable<AppUrl>;
    get qrUrl(): Mutable<string>;
    activate(): void;
    inactivate(): void;
    get client(): WalletClient;
    initingClient(): void;
    initClientDone(client: WalletClient | undefined): void;
    initClientError(error: Error | undefined): void;
    get walletInfo(): Wallet;
    get downloadInfo(): DownloadInfo | undefined;
    get walletName(): string;
    get walletPrettyName(): string;
    get rejectMessageSource(): string;
    get rejectMessageTarget(): string;
    get rejectCode(): number;
    rejectMatched(e: Error): boolean;
    updateCallbacks(callbacks: Callbacks): void;
    protected _disconnect: (sync?: boolean) => Promise<void>;
    disconnect: (sync?: boolean) => Promise<void>;
    setClientNotExist(): void;
    setRejected(): void;
    setError(e?: Error | string): void;
    connect: (sync?: boolean) => Promise<void>;
    abstract initClient(options?: any): void | Promise<void>;
    abstract update(): void | Promise<void>;
}

declare class ChainWalletBase extends WalletBase {
    protected _chainRecord: ChainRecord;
    rpcEndpoints?: (string | ExtendedHttpEndpoint)[];
    restEndpoints?: (string | ExtendedHttpEndpoint)[];
    protected _rpcEndpoint?: string | ExtendedHttpEndpoint;
    protected _restEndpoint?: string | ExtendedHttpEndpoint;
    offlineSigner?: OfflineSigner;
    namespace: string;
    isLazy?: boolean;
    constructor(walletInfo: Wallet, chainRecord: ChainRecord);
    get chainRecord(): ChainRecord;
    get chainName(): string;
    get chainLogoUrl(): string | undefined;
    get stargateOptions(): StargateClientOptions | undefined;
    get signingStargateOptions(): SigningStargateClientOptions | undefined;
    get signingCosmwasmOptions(): SigningCosmWasmClientOptions | undefined;
    get preferredSignType(): SignType;
    get chain(): _chain_registry_types.Chain;
    get assets(): _chain_registry_types.Asset[];
    get assetList(): _chain_registry_types.AssetList;
    get chainId(): string;
    get cosmwasmEnabled(): boolean;
    get username(): string | undefined;
    get address(): string | undefined;
    setData(data: SimpleAccount | undefined): void;
    initClient(_options?: any): void | Promise<void>;
    update(): Promise<void>;
    getRpcEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getRestEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getStargateClient: () => Promise<StargateClient>;
    getCosmWasmClient: () => Promise<CosmWasmClient>;
    getNameService: () => Promise<NameService>;
    initOfflineSigner(): Promise<void>;
    getSigningStargateClient: () => Promise<SigningStargateClient>;
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
    protected getSigningClient: (type?: CosmosClientType) => Promise<SigningStargateClient | SigningCosmWasmClient>;
    estimateFee: (messages: EncodeObject[], type?: CosmosClientType, memo?: string, multiplier?: number) => Promise<StdFee>;
    sign: (messages: EncodeObject[], fee?: StdFee | number, memo?: string, type?: CosmosClientType) => Promise<TxRaw>;
    broadcast: (signedMessages: TxRaw, type?: CosmosClientType) => Promise<_cosmjs_stargate.DeliverTxResponse>;
    signAndBroadcast: (messages: EncodeObject[], fee?: StdFee | number, memo?: string, type?: CosmosClientType) => Promise<_cosmjs_stargate.DeliverTxResponse>;
}

declare abstract class MainWalletBase extends WalletBase {
    protected _chainWalletMap?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions['endpoints'];
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    initingClient(): void;
    initClientDone(client: WalletClient | undefined): void;
    initClientError(error: Error | undefined): void;
    protected onSetChainsDone(): void;
    setChains(chains: ChainRecord[], overwrite?: boolean): void;
    get chainWalletMap(): Map<string, ChainWalletBase>;
    getChainWallet: (chainName: string) => ChainWalletBase | undefined;
    getChainWalletList: (activeOnly?: boolean) => ChainWalletBase[];
    getGlobalStatusAndMessage: (activeOnly?: boolean) => [WalletStatus, string | undefined];
    update(): Promise<void>;
    reset(): void;
    connectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
    disconnectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
}

interface Key {
    readonly name: string;
    readonly algo: string;
    readonly pubKey: Uint8Array;
    readonly address: Uint8Array;
    readonly bech32Address: string;
    readonly isNanoLedger: boolean;
    readonly isSmartContract?: boolean;
}
interface SimpleAccount {
    namespace: string;
    chainId: string;
    address: string;
    username?: string;
}
declare type WalletName = string;
declare enum WalletStatus {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    NotExist = "NotExist",
    Rejected = "Rejected",
    Error = "Error"
}
interface DownloadInfo extends DappEnv {
    icon?: string | ((props: any) => JSX.Element);
    link: string;
}
declare type WalletMode = 'extension' | 'wallet-connect';
interface Metadata {
    name: string;
    description: string;
    url: string;
    icons: string[];
}
interface AppUrl {
    native?: string | {
        android?: string;
        ios?: string;
        macos?: string;
        windows?: string;
    };
    universal?: string;
}
interface Wallet {
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
declare type Bech32Address = string;
interface WalletAccount extends AccountData {
    username?: string;
    isNanoLedger?: boolean;
    isSmartContract?: boolean;
}
interface SignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
interface DirectSignDoc {
    /** SignDoc bodyBytes */
    bodyBytes?: Uint8Array | null;
    /** SignDoc authInfoBytes */
    authInfoBytes?: Uint8Array | null;
    /** SignDoc chainId */
    chainId?: string | null;
    /** SignDoc accountNumber */
    accountNumber?: Long | null;
}
declare enum BroadcastMode {
    /** Return after tx commit */
    Block = "block",
    /** Return after CheckTx */
    Sync = "sync",
    /** Return right away */
    Async = "async"
}
interface SuggestCW20Token {
    contractAddress: string;
    viewingKey?: string;
    imageURL?: string;
    coinGeckoId?: string;
}
declare const SuggestTokenTypes: {
    readonly CW20: "cw20";
    readonly ERC20: "erc20";
};
declare type SuggestTokenType = typeof SuggestTokenTypes[keyof typeof SuggestTokenTypes];
interface SuggestToken {
    chainId: string;
    chainName: string;
    type: SuggestTokenType;
    tokens: SuggestCW20Token[];
}
interface WalletClient {
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
declare type WalletAdapter = ChainWalletBase | MainWalletBase;
interface IChainWallet {
    new (walletInfo: Wallet, chainInfo: ChainRecord): ChainWalletBase;
}
declare type NameServiceName = string;
interface NameServiceRegistry {
    name: NameServiceName;
    contract: string;
    chainName: ChainName;
    getQueryMsg: (address: Bech32Address) => any;
    slip173: string;
}
interface WalletConnectOptions {
    signClient: {
        projectId: string;
    } & SignClientTypes.Options;
}

interface SignerOptions {
    stargate?: (chain: Chain) => StargateClientOptions | undefined;
    signingStargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
    signingCosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
    preferredSignType?: (chain: Chain) => SignType | undefined;
}
interface ViewOptions {
    alwaysOpenView?: boolean;
    closeViewWhenWalletIsConnected?: boolean;
    closeViewWhenWalletIsDisconnected?: boolean;
    closeViewWhenWalletIsRejected?: boolean;
}
interface StorageOptions {
    disabled?: boolean;
    /**
     * Duration in ms.
     */
    duration?: number;
    clearOnTabClose?: boolean;
}
interface SessionOptions {
    /**
     * Duration in ms.
     */
    duration: number;
    callback?: () => void;
}
interface ExtendedHttpEndpoint extends HttpEndpoint {
    isLazy?: boolean;
}
interface Endpoints {
    rpc?: (string | ExtendedHttpEndpoint)[];
    rest?: (string | ExtendedHttpEndpoint)[];
    isLazy?: boolean;
}
interface EndpointOptions {
    isLazy?: boolean;
    endpoints?: Record<ChainName, Endpoints>;
}
interface ManagerActions<T> extends StateActions<T> {
    walletName?: Dispatch<WalletName | undefined>;
    chainName?: Dispatch<ChainName | undefined>;
    viewOpen?: Dispatch<boolean>;
}
declare type EventName = 'refresh_connection';

declare type ChainName = string;
interface ChainRecord {
    name: ChainName;
    chain: Chain;
    assetList?: AssetList;
    clientOptions?: {
        signingStargate?: SigningStargateClientOptions;
        signingCosmwasm?: SigningCosmWasmClientOptions;
        stargate?: StargateClientOptions;
        preferredSignType?: SignType;
    };
    preferredEndpoints?: Endpoints;
}

export { AppUrl as A, Bech32Address as B, ChainWalletBase as C, DownloadInfo as D, ExtendedHttpEndpoint as E, WalletConnectOptions as F, Session as G, NameService as H, IChainWallet as I, Key as K, MainWalletBase as M, NameServiceName as N, StateBase as S, ViewOptions as V, WalletBase as W, ChainName as a, ChainRecord as b, SignerOptions as c, StorageOptions as d, SessionOptions as e, Endpoints as f, EndpointOptions as g, ManagerActions as h, EventName as i, SimpleAccount as j, WalletName as k, WalletStatus as l, WalletMode as m, Metadata as n, Wallet as o, WalletAccount as p, SignOptions as q, DirectSignDoc as r, BroadcastMode as s, SuggestCW20Token as t, SuggestTokenTypes as u, SuggestTokenType as v, SuggestToken as w, WalletClient as x, WalletAdapter as y, NameServiceRegistry as z };

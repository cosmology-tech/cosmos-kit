import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { ChainInfo, Keplr } from '@keplr-wallet/types';
import WalletConnect from '@walletconnect/client';
import { IClientMeta } from '@walletconnect/types';
export interface CosmosWalletConfig {
    enabledWallets: Wallet<any>[];
    defaultChainId: string;
    chainInfoOverrides?: ChainInfoOverrides;
    walletConnectClientMeta?: IClientMeta;
    preselectedWalletId?: string;
    localStorageKey?: string;
    getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>;
    getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>;
}
export declare type CosmosWalletInitializeConfig = Omit<CosmosWalletConfig, 'enabledWallets'> & Partial<Pick<CosmosWalletConfig, 'enabledWallets'>>;
export interface CosmosWalletState {
    walletConnectQrUri?: string;
    connectedWallet?: ConnectedWallet;
    connectingWallet?: Wallet;
    status: CosmosWalletStatus;
    error?: unknown;
    chainInfoOverrides?: ChainInfoOverrides;
    getSigningCosmWasmClientOptions?: SigningClientGetter<SigningCosmWasmClientOptions>;
    getSigningStargateClientOptions?: SigningClientGetter<SigningStargateClientOptions>;
    enabledWallets: Wallet[];
}
export declare type CosmosWalletStateObserver = (state: CosmosWalletState) => void;
export interface IKeplrWalletConnectV1 extends Keplr {
    dontOpenAppOnEnable: boolean;
}
export interface Wallet<Client = unknown> {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    isWalletConnect: boolean;
    walletConnectDeeplinkFormats?: DeeplinkFormats;
    walletConnectSigningMethods?: string[];
    getClient: (chainInfo: ChainInfo, walletConnect?: WalletConnect, newWalletConnectSession?: boolean) => Promise<Client | undefined>;
    getOfflineSignerFunction: (client: Client) => (chainId: string) => OfflineSigner | Promise<OfflineSigner>;
    enableClient: (client: Client, chainInfo: ChainInfo) => Promise<void>;
    cleanupClient?: (client: Client) => Promise<void>;
    getNameAddress: (client: Client, chainInfo: ChainInfo) => Promise<{
        name: string;
        address: string;
    }>;
    shouldAutoconnect?: () => boolean | Promise<boolean>;
    addRefreshListener?: (listener: () => void) => void;
    removeRefreshListener?: (listener: () => void) => void;
}
export interface ConnectedWallet<Client = unknown> {
    wallet: Wallet<Client>;
    walletClient: Client;
    chainInfo: ChainInfo;
    offlineSigner: OfflineSigner;
    name: string;
    address: string;
    signingCosmWasmClient: SigningCosmWasmClient;
    signingStargateClient: SigningStargateClient;
}
export declare type SigningClientGetter<T> = (chainInfo: ChainInfo) => T | Promise<T | undefined> | undefined;
export declare type ChainInfoOverrides = ChainInfo[] | (() => undefined | ChainInfo[] | Promise<undefined | ChainInfo[]>);
export declare enum CosmosWalletStatus {
    Uninitialized = 0,
    Disconnected = 1,
    Connecting = 2,
    ChoosingWallet = 3,
    PendingWalletConnect = 4,
    EnablingWallet = 5,
    Connected = 6,
    Errored = 7
}
export interface DeeplinkFormats {
    ios: string;
    android: string;
}
export declare enum ChainInfoID {
    Osmosis1 = "osmosis-1",
    Cosmoshub4 = "cosmoshub-4",
    Columbus5 = "columbus-5",
    Secret4 = "secret-4",
    Akashnet2 = "akashnet-2",
    Regen1 = "regen-1",
    Sentinelhub2 = "sentinelhub-2",
    Core1 = "core-1",
    Irishub1 = "irishub-1",
    CryptoOrgChainMainnet1 = "crypto-org-chain-mainnet-1",
    IovMainnetIbc = "iov-mainnet-ibc",
    Emoney3 = "emoney-3",
    Juno1 = "juno-1",
    Uni3 = "uni-3",
    Microtick1 = "microtick-1",
    LikecoinMainnet2 = "likecoin-mainnet-2",
    Impacthub3 = "impacthub-3",
    Bitcanna1 = "bitcanna-1",
    Bitsong2b = "bitsong-2b",
    Kichain2 = "kichain-2",
    Panacea3 = "panacea-3",
    Bostrom = "bostrom",
    Comdex1 = "comdex-1",
    CheqdMainnet1 = "cheqd-mainnet-1",
    Stargaze1 = "stargaze-1",
    Chihuahua1 = "chihuahua-1",
    LumNetwork1 = "lum-network-1",
    Vidulum1 = "vidulum-1",
    DesmosMainnet = "desmos-mainnet",
    Dig1 = "dig-1",
    Sommelier3 = "sommelier-3",
    Sifchain1 = "sifchain-1",
    LaoziMainnet = "laozi-mainnet",
    Darchub = "darchub",
    Umee1 = "umee-1",
    GravityBridge3 = "gravity-bridge-3",
    Mainnet3 = "mainnet-3",
    Shentu22 = "shentu-2.2",
    Carbon1 = "carbon-1",
    Injective1 = "injective-1",
    CerberusChain1 = "cerberus-chain-1",
    Fetchhub4 = "fetchhub-4",
    Mantle1 = "mantle-1",
    PioMainnet1 = "pio-mainnet-1",
    Galaxy1 = "galaxy-1",
    Meme1 = "meme-1",
    Evmos_9001_2 = "evmos_9001-2",
    Phoenix1 = "phoenix-1",
    Titan1 = "titan-1",
    Kava_2222_10 = "kava_2222-10",
    Genesis_29_2 = "genesis_29-2"
}

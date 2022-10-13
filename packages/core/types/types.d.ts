import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { IconType } from 'react-icons';
import { ChainWalletBase, MainWalletBase } from './bases';
export interface ChainWalletDataBase {
    address?: string;
    offlineSigner?: OfflineSigner;
}
export interface MainWalletDataBase {
    username?: string;
}
export interface ChainWalletData extends ChainWalletDataBase {
    [k: string]: any | undefined;
}
export interface MainWalletData extends MainWalletDataBase {
    [k: string]: any | undefined;
}
export declare type WalletData = ChainWalletData | MainWalletData;
export interface ChainWallet extends ChainWalletBase<unknown, ChainWalletData> {
    [k: string]: any | undefined;
}
export interface WalletOption extends MainWalletBase<unknown, MainWalletData, ChainWallet> {
    [k: string]: any | undefined;
}
export declare type WalletAdapter = ChainWallet | WalletOption;
export declare enum State {
    Init = "Init",
    Pending = "Pending",
    Done = "Done",
    Error = "Error"
}
export declare enum WalletStatus {
    Disconnected = "Disconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    NotExist = "NotExist",
    Rejected = "Rejected",
    Error = "Error"
}
export interface Mutable<T> {
    state: State;
    data?: T;
    message?: string;
}
export declare type ChainName = string;
export declare type WalletName = string;
export declare type Dispatch<T> = (value: T) => void;
interface Icon {
    browser?: string;
    os?: string;
    icon: IconType;
    link: string;
}
export interface Wallet {
    name: WalletName;
    prettyName: string;
    isQRCode: boolean;
    downloads?: {
        default: string;
        desktop?: Icon[];
        tablet?: Icon[];
        mobile?: Icon[];
    };
    logo?: string;
    qrCodeLink?: string;
}
export interface ChainRecord {
    name: ChainName;
    chain: Chain;
    assetList: AssetList;
    signerOptions?: {
        stargate?: SigningStargateClientOptions;
        cosmwasm?: SigningCosmWasmClientOptions;
    };
    preferredEndpoints?: Endpoints;
}
export interface WalletModalProps {
    isOpen: boolean;
    setOpen: Dispatch<boolean>;
}
export interface Actions {
    [k: string]: Dispatch<any> | undefined;
}
export interface StateActions<T> extends Actions {
    state?: Dispatch<State>;
    data?: Dispatch<T | undefined>;
    message?: Dispatch<string | undefined>;
}
export interface ManagerActions<T> extends StateActions<T> {
    walletName?: Dispatch<WalletName | undefined>;
    chainName?: Dispatch<ChainName | undefined>;
    viewOpen?: Dispatch<boolean>;
}
export interface SignerOptions {
    stargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
    cosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
}
export interface ViewOptions {
    alwaysOpenView?: boolean;
    closeViewWhenWalletIsConnected?: boolean;
    closeViewWhenWalletIsDisconnected?: boolean;
    closeViewWhenWalletIsRejected?: boolean;
}
export interface StorageOptions {
    disabled?: boolean;
    duration?: number;
    clearOnTabClose?: boolean;
}
export interface SessionOptions {
    duration?: number;
    killOnTabClose?: boolean;
}
export interface Endpoints {
    rpc?: string[];
    rest?: string[];
}
export declare type EndpointOptions = Record<ChainName, Endpoints>;
export interface Callbacks {
    connect?: () => void;
    disconnect?: () => void;
}
export {};

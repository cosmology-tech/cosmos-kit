import { Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { WalletRepo } from '../repository';
import { ChainName } from './chain';
import { Dispatch, StateActions } from './common';
import { WalletName } from './wallet';
export interface SignerOptions {
    stargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
    signingStargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
    signingCosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
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
export interface WalletModalProps {
    isOpen: boolean;
    setOpen: Dispatch<boolean>;
}
export interface WalletModalPropsV2 {
    isOpen: boolean;
    setOpen: Dispatch<boolean>;
    walletRepo?: WalletRepo;
    theme?: Record<string, any>;
}
export interface ManagerActions<T> extends StateActions<T> {
    walletName?: Dispatch<WalletName | undefined>;
    chainName?: Dispatch<ChainName | undefined>;
    viewOpen?: Dispatch<boolean>;
}

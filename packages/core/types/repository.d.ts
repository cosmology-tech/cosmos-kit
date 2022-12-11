import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import { AppEnv, ChainRecord, Data, SessionOptions, WalletName } from './types';
/**
 * Store all ChainWallets for a particular Chain.
 */
export declare class WalletRepo extends StateBase<Data> {
    isInUse: boolean;
    chainRecord: ChainRecord;
    private _wallets;
    options: {
        mutexWallet: boolean;
    };
    sessionOptions?: SessionOptions;
    constructor(chainRecord: ChainRecord, wallets?: ChainWalletBase[], sessionOptions?: SessionOptions);
    setEnv(env?: AppEnv): void;
    get chainName(): string;
    get chainLogo(): string | undefined;
    get wallets(): ChainWalletBase[];
    get isSingleWallet(): boolean;
    get current(): ChainWalletBase | undefined;
    getWallet: (walletName: WalletName) => ChainWalletBase | undefined;
    openView: () => void;
    closeView: () => void;
    connect: (walletName?: WalletName) => Promise<void>;
    disconnect: (walletName?: WalletName) => Promise<void>;
    getRpcEndpoint: () => Promise<string>;
    getRestEndpoint: () => Promise<string>;
    getStargateClient: () => Promise<StargateClient>;
    getCosmWasmClient: () => Promise<CosmWasmClient>;
}

import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import { NameService } from './name-service';
import { DappEnv, ChainRecord, WalletName, ExtendedHttpEndpoint } from './types';
import { Session } from './utils';
/**
 * Store all ChainWallets for a particular Chain.
 */
export declare class WalletRepo extends StateBase {
    isActive: boolean;
    chainRecord: ChainRecord;
    private _wallets;
    namespace: string;
    session: Session;
    repelWallet: boolean;
    constructor(chainRecord: ChainRecord, wallets?: ChainWalletBase[]);
    setEnv(env?: DappEnv): void;
    activate(): void;
    get chainName(): string;
    get chainLogo(): string | undefined;
    get wallets(): ChainWalletBase[];
    get isSingleWallet(): boolean;
    get current(): ChainWalletBase | undefined;
    getWallet: (walletName: WalletName) => ChainWalletBase | undefined;
    openView: () => void;
    closeView: () => void;
    connect: (walletName?: WalletName, sync?: boolean) => Promise<void>;
    disconnect: (walletName?: WalletName, sync?: boolean) => Promise<void>;
    getRpcEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getRestEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getStargateClient: () => Promise<StargateClient>;
    getCosmWasmClient: () => Promise<CosmWasmClient>;
    getNameService: () => Promise<NameService>;
}

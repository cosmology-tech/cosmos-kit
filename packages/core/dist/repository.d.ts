import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { S as StateBase, b as ChainRecord, G as Session, C as ChainWalletBase, k as WalletName, E as ExtendedHttpEndpoint, H as NameService } from './chain-932d9904.js';
import { DappEnv } from './types/common.js';
import '@chain-registry/types';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';
import './utils/logger.js';
import 'events';

/**
 * Store all ChainWallets for a particular Chain.
 */
declare class WalletRepo extends StateBase {
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

export { WalletRepo };

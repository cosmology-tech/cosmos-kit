import { ChainName, ChainRecord } from '../types';
import { MainWalletDataBase, ChainWalletDataBase } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { StateBase } from './state';
export declare abstract class MainWalletBase<WalletClient, MainWalletData extends MainWalletDataBase, ChainWalletData extends ChainWalletDataBase, ChainWallet extends ChainWalletBase<WalletClient, ChainWalletData, unknown>> extends StateBase<MainWalletData> {
    protected abstract _chains: Map<ChainName, ChainWallet>;
    protected abstract _client: Promise<WalletClient | undefined> | WalletClient | undefined;
    protected _supportedChains: ChainRecord[];
    protected _concurrency: number;
    constructor(_concurrency?: number);
    get client(): WalletClient | Promise<WalletClient>;
    setSupportedChains(chains: ChainRecord[]): void;
    get username(): string | undefined;
    get supportedChains(): ChainRecord[];
    get concurrency(): number;
    get chains(): Map<string, ChainWallet>;
    get count(): number;
    get chainNames(): ChainName[];
    get chainList(): ChainWallet[];
    getChain(chainName: string): ChainWallet;
    disconnect(): void;
    connect(): Promise<void>;
    protected abstract setChains(supportedChains?: ChainRecord[]): void;
}

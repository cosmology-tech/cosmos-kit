import { ChainName, ChainInfo, Wallet } from '../types';
import { ChainWalletDataBase, MainWalletDataBase } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { StateBase } from './state';
export declare abstract class MainWalletBase<WalletClient, MainWalletData extends MainWalletDataBase, ChainWalletData extends ChainWalletDataBase, ChainWallet extends ChainWalletBase<WalletClient, ChainWalletData, any>> extends StateBase<MainWalletData> {
    protected abstract _chains: Map<ChainName, ChainWallet>;
    protected abstract _client: Promise<WalletClient | undefined> | WalletClient | undefined;
    protected _chainsInfo: ChainInfo[];
    protected _walletInfo: Wallet;
    constructor(_walletInfo: Wallet, _chainsInfo?: ChainInfo[]);
    get client(): WalletClient | Promise<WalletClient>;
    get walletInfo(): Wallet;
    get walletName(): string;
    get username(): string | undefined;
    get chains(): Map<string, ChainWallet>;
    get count(): number;
    get chainNames(): ChainName[];
    get chainList(): ChainWallet[];
    getChain(chainName: string): ChainWallet;
    disconnect(): void;
    connect(): Promise<void>;
    abstract setChains(supportedChains?: ChainInfo[]): void;
}

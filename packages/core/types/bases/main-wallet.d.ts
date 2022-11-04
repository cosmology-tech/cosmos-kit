import { Callbacks, ChainName, ChainRecord, EndpointOptions, IChainWallet, MainWalletData, Wallet, WalletClient } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase extends WalletBase<MainWalletData> {
    protected _chainWallets?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions;
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    protected setChainsCallback(): void;
    setChains(chains: ChainRecord[]): void;
    get username(): string | undefined;
    get chainWallets(): Map<string, ChainWalletBase>;
    getChainWallet(chainName: string): ChainWalletBase | undefined;
    update(callbacks?: Callbacks): Promise<void>;
    disconnect(callbacks?: Callbacks): void;
    abstract fetchClient(): WalletClient | undefined | Promise<WalletClient | undefined>;
}

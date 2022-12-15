import { Callbacks, ChainName, ChainRecord, EndpointOptions, IChainWallet, MainWalletData, SessionOptions, Wallet } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase extends WalletBase<MainWalletData> {
    protected _chainWallets?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions;
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    protected onSetChainsDone(): void;
    setChains(chains: ChainRecord[]): void;
    get username(): string | undefined;
    get chainWallets(): Map<string, ChainWalletBase>;
    getChainWallet: (chainName: string) => ChainWalletBase | undefined;
    update(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    reset(): void;
}

import { Callbacks, ChainName, ChainRecord, EndpointOptions, IChainWallet, SessionOptions, Wallet } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase extends WalletBase {
    protected _chainWallets?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions;
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    protected onSetChainsDone(): void;
    setChains(chains: ChainRecord[], overwrite?: boolean): void;
    get username(): string | undefined;
    get chainWallets(): Map<string, ChainWalletBase>;
    getChainWallet: (chainName: string) => ChainWalletBase | undefined;
    update(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    reset(): void;
    connectActive(exclude?: ChainName): Promise<void>;
    disconnectActive(exclude?: ChainName): void;
}

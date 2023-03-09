import { Callbacks, ChainName, ChainRecord, EndpointOptions, IChainWallet, Wallet, WalletStatus } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase extends WalletBase {
    protected _chainWalletMap?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions;
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    protected onSetChainsDone(): void;
    setChains(chains: ChainRecord[], overwrite?: boolean): void;
    get chainWalletMap(): Map<string, ChainWalletBase>;
    getChainWallet: (chainName: string) => ChainWalletBase | undefined;
    getChainWalletList: (activeOnly?: boolean) => ChainWalletBase[];
    getGlobalStatusAndMessage: (activeOnly?: boolean) => [WalletStatus, string | undefined];
    update(callbacks?: Callbacks): Promise<void>;
    connectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
    disconnectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
}

import { ChainName, ChainRecord, EndpointOptions, IChainWallet, Wallet, WalletClient, WalletStatus } from '../types';
import { ChainWalletBase } from './chain-wallet';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase extends WalletBase {
    protected _chainWalletMap?: Map<ChainName, ChainWalletBase>;
    preferredEndpoints?: EndpointOptions['endpoints'];
    ChainWallet: IChainWallet;
    constructor(walletInfo: Wallet, ChainWallet: IChainWallet);
    initingClient(): void;
    initClientDone(client: WalletClient | undefined): void;
    initClientError(error: Error | undefined): void;
    protected onSetChainsDone(): void;
    setChains(chains: ChainRecord[], overwrite?: boolean): void;
    get chainWalletMap(): Map<string, ChainWalletBase>;
    getChainWallet: (chainName: string) => ChainWalletBase | undefined;
    getChainWalletList: (activeOnly?: boolean) => ChainWalletBase[];
    getGlobalStatusAndMessage: (activeOnly?: boolean) => [WalletStatus, string | undefined];
    update(): Promise<void>;
    connectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
    disconnectAll(activeOnly?: boolean, exclude?: ChainName): Promise<void>;
}

import { AssetList, Chain } from '@chain-registry/types';
import { ChainWalletBase, MainWalletBase, StateBase } from './bases';
import { ChainName, ChainRecord, Data, EndpointOptions, SessionOptions, SignerOptions, ViewOptions, WalletName } from './types';
import { WalletRepo } from './wallet-repo';
export declare class WalletManagerV2 extends StateBase<Data> {
    chainRecords: ChainRecord[];
    allWallets: ChainWalletBase[];
    chainToWalletHash: Map<ChainName, Map<WalletName, ChainWalletBase>>;
    walletToChainHash: Map<WalletName, Map<ChainName, ChainWalletBase>>;
    viewOptions: ViewOptions;
    sessionOptions: SessionOptions;
    constructor(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], signerOptions?: SignerOptions, viewOptions?: ViewOptions, endpointOptions?: EndpointOptions, sessionOptions?: SessionOptions);
    get wallets(): ChainWalletBase[];
    getWalletRepo: (chainName?: ChainName, walletName?: WalletName) => WalletRepo;
    getChainRecord: (chainName?: ChainName) => ChainRecord | undefined;
    getChainLogo: (chainName?: ChainName) => string | undefined;
    connect: (chainName?: ChainName, walletName?: WalletName) => Promise<void>;
    disconnect: (chainName?: ChainName, walletName?: WalletName) => Promise<void>;
    private _handleTabLoad;
    private _handleTabClose;
    private _connectEventLisener;
    onMounted: () => void;
    onUnmounted: () => void;
}

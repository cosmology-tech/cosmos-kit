import { AssetList, Chain } from '@chain-registry/types';
import { MainWalletBase, StateBase } from './bases';
import { WalletRepo } from './repository';
import { ChainName, ChainRecord, Data, EndpointOptions, SessionOptions, SignerOptions } from './types';
import { SignClientTypes } from '@walletconnect/types';
export declare class WalletManagerV2 extends StateBase<Data> {
    chainRecords: ChainRecord[];
    walletRepos: WalletRepo[];
    private _wallets;
    options: {
        synchroMutexWallet: boolean;
    };
    sessionOptions: SessionOptions;
    constructor(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], wcSignClientOptions?: SignClientTypes.Options, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions, sessionOptions?: SessionOptions);
    private synchroMutexWallet;
    init(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], wcSignClientOptions?: SignClientTypes.Options, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions): void;
    addChains: (chains: Chain[], assetLists: AssetList[], signerOptions?: SignerOptions, endpointOptions?: EndpointOptions) => void;
    get walletReposInUse(): WalletRepo[];
    synchronizeMutexWalletConnection(): Promise<void>;
    getWalletRepo: (chainName: ChainName) => WalletRepo;
    getChainRecord: (chainName?: ChainName) => ChainRecord | undefined;
    getChainLogo: (chainName?: ChainName) => string | undefined;
    private _handleConnect;
    onMounted: () => void;
    onUnmounted: () => void;
}

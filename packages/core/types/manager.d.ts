import { AssetList, Chain } from '@chain-registry/types';
import { SignClientTypes } from '@walletconnect/types';
import { MainWalletBase, StateBase } from './bases';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import { ChainName, ChainRecord, Data, EndpointOptions, NameServiceName, SessionOptions, SignerOptions } from './types';
export declare class WalletManager extends StateBase<Data> {
    chainRecords: ChainRecord[];
    walletRepos: WalletRepo[];
    defaultNameService?: NameServiceName;
    private _wallets;
    options: {
        synchroMutexWallet: boolean;
    };
    sessionOptions: SessionOptions;
    constructor(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], defaultNameService?: NameServiceName, wcSignClientOptions?: SignClientTypes.Options, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions, sessionOptions?: SessionOptions);
    private synchroMutexWallet;
    init(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], wcSignClientOptions?: SignClientTypes.Options, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions): void;
    addChains: (chains: Chain[], assetLists: AssetList[], signerOptions?: SignerOptions, endpointOptions?: EndpointOptions) => void;
    get walletReposInUse(): WalletRepo[];
    synchronizeMutexWalletConnection(): Promise<void>;
    getWalletRepo: (chainName: ChainName) => WalletRepo;
    getChainRecord: (chainName: ChainName) => ChainRecord;
    getChainLogo: (chainName: ChainName) => string | undefined;
    getNameService: (chainName?: ChainName) => Promise<NameService | undefined>;
    private _handleConnect;
    onMounted: () => void;
    onUnmounted: () => void;
}

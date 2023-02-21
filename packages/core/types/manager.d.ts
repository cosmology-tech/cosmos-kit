import { AssetList, Chain } from '@chain-registry/types';
import { MainWalletBase, StateBase } from './bases';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import { ChainName, ChainRecord, EndpointOptions, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions } from './types';
import { Logger, Session } from './utils';
export declare class WalletManager extends StateBase {
    chainRecords: ChainRecord[];
    walletRepos: WalletRepo[];
    defaultNameService: NameServiceName;
    private _wallets;
    readonly sessionOptions: SessionOptions;
    walletConnectOptions?: WalletConnectOptions;
    readonly session: Session;
    constructor(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], logger: Logger, defaultNameService?: NameServiceName, walletConnectOptions?: WalletConnectOptions, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions, sessionOptions?: SessionOptions);
    init(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], walletConnectOptions?: WalletConnectOptions, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions): void;
    addChains: (chains: Chain[], assetLists: AssetList[], signerOptions?: SignerOptions, endpointOptions?: EndpointOptions) => void;
    get activeRepos(): WalletRepo[];
    getWalletRepo: (chainName: ChainName) => WalletRepo;
    getChainRecord: (chainName: ChainName) => ChainRecord;
    getChainLogo: (chainName: ChainName) => string | undefined;
    getNameService: (chainName?: ChainName) => Promise<NameService>;
    private _handleConnect;
    private _restoreAccounts;
    onMounted: () => Promise<void>;
    onUnmounted: () => void;
}

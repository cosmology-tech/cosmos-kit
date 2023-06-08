/// <reference types="node" />
import { AssetList, Chain } from '@chain-registry/types';
import EventEmitter from 'events';
import { ChainWalletBase, MainWalletBase, StateBase } from './bases';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import { ChainName, ChainRecord, EndpointOptions, EventName, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions, WalletName } from './types';
import { Logger, Session } from './utils';
export declare class WalletManager extends StateBase {
    chainRecords: ChainRecord[];
    walletRepos: WalletRepo[];
    defaultNameService: NameServiceName;
    mainWallets: MainWalletBase[];
    coreEmitter: EventEmitter;
    walletConnectOptions?: WalletConnectOptions;
    readonly session: Session;
    repelWallet: boolean;
    isLazy?: boolean;
    throwErrors: boolean;
    constructor(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], logger: Logger, throwErrors?: boolean, defaultNameService?: NameServiceName, walletConnectOptions?: WalletConnectOptions, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions, sessionOptions?: SessionOptions);
    init(chains: Chain[], assetLists: AssetList[], wallets: MainWalletBase[], walletConnectOptions?: WalletConnectOptions, signerOptions?: SignerOptions, endpointOptions?: EndpointOptions): void;
    setWalletRepel(value: boolean): void;
    addChains: (chains: Chain[], assetLists: AssetList[], signerOptions?: SignerOptions, endpoints?: EndpointOptions['endpoints']) => void;
    on: (event: EventName, handler: (params: any) => void) => void;
    off: (event: EventName, handler: (params: any) => void) => void;
    get activeRepos(): WalletRepo[];
    getMainWallet: (walletName: WalletName) => MainWalletBase;
    getWalletRepo: (chainName: ChainName) => WalletRepo;
    getChainWallet: (chainName: ChainName, walletName: WalletName) => ChainWalletBase;
    getChainRecord: (chainName: ChainName) => ChainRecord;
    getChainLogo: (chainName: ChainName) => string | undefined;
    getNameService: (chainName?: ChainName) => Promise<NameService>;
    private _reconnect;
    private _restoreAccounts;
    onMounted: () => Promise<void>;
    onUnmounted: () => void;
}

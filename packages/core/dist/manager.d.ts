import { Chain, AssetList } from '@chain-registry/types';
import EventEmitter from 'events';
import { S as StateBase, b as ChainRecord, N as NameServiceName, M as MainWalletBase, F as WalletConnectOptions, G as Session, c as SignerOptions, g as EndpointOptions, e as SessionOptions, i as EventName, k as WalletName, a as ChainName, C as ChainWalletBase, H as NameService } from './chain-932d9904.js';
import { WalletRepo } from './repository.js';
import { Logger } from './utils/logger.js';
import '@cosmjs/cosmwasm-stargate';
import '@cosmjs/stargate';
import './types/common.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@walletconnect/types';
import 'cosmjs-types/cosmos/tx/v1beta1/tx';

declare class WalletManager extends StateBase {
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

export { WalletManager };

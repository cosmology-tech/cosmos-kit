import { AssetList, Chain } from '@chain-registry/types';
import Bowser from 'bowser';
import EventEmitter from 'events';

import { ChainWalletBase, MainWalletBase, StateBase } from './bases';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import {
  ChainName,
  ChainRecord,
  DeviceType,
  EndpointOptions,
  EventName,
  NameServiceName,
  OS,
  SessionOptions,
  SignerOptions,
  SimpleAccount,
  State,
  WalletConnectOptions,
  WalletName,
} from './types';
import {
  convertChain,
  getNameServiceRegistryFromName,
  Logger,
  Session,
} from './utils';

export class WalletManager extends StateBase {
  chainRecords: ChainRecord[] = [];
  walletRepos: WalletRepo[] = [];
  defaultNameService: NameServiceName = 'icns';
  mainWallets: MainWalletBase[] = [];
  coreEmitter: EventEmitter;
  walletConnectOptions?: WalletConnectOptions;
  readonly session: Session;
  repelWallet: boolean = true; // only allow one wallet type to connect at one time. i.e. you cannot connect keplr and cosmostation at the same time
  isLazy?: boolean; // stands for `globalIsLazy` setting
  throwErrors: boolean;

  constructor(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: MainWalletBase[],
    logger: Logger,
    throwErrors: boolean = false,
    defaultNameService?: NameServiceName,
    walletConnectOptions?: WalletConnectOptions,
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    this.throwErrors = throwErrors;
    this.coreEmitter = new EventEmitter();
    this.logger = logger;
    if (defaultNameService) this.defaultNameService = defaultNameService;
    this.session = new Session({
      duration: 1800000,
      callback: () => {
        this.mainWallets.forEach((w) => w.disconnectAll(false));
        window?.localStorage.removeItem('cosmos-kit@1:core//accounts');
      },
      ...sessionOptions,
    });
    this.walletConnectOptions = walletConnectOptions;
    this.init(
      chains,
      assetLists,
      wallets,
      walletConnectOptions,
      signerOptions,
      endpointOptions
    );
  }

  init(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: MainWalletBase[],
    walletConnectOptions?: WalletConnectOptions,
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions
  ) {
    this.logger.info(
      `${chains.length} chains and ${wallets.length} wallets are provided!`
    );
    this.isLazy = endpointOptions?.isLazy;

    this.chainRecords = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpointOptions?.endpoints?.[chain.chain_name],
        this.isLazy,
        this.logger
      )
    );

    this.mainWallets = wallets.map((wallet) => {
      wallet.logger = this.logger;
      wallet.throwErrors = this.throwErrors;
      wallet.session = this.session;
      wallet.walletConnectOptions = this.walletConnectOptions;
      wallet.setChains(this.chainRecords);
      return wallet;
    });

    this.chainRecords.forEach((chainRecord) => {
      const repo = new WalletRepo(
        chainRecord,
        wallets.map(({ getChainWallet }) => getChainWallet(chainRecord.name)!)
      );
      repo.logger = this.logger;
      repo.repelWallet = this.repelWallet;
      repo.session = this.session;
      this.walletRepos.push(repo);
    });
  }

  setWalletRepel(value: boolean) {
    this.repelWallet = value;
    this.walletRepos.forEach((repo) => (repo.repelWallet = value));
    window?.localStorage.setItem(
      'cosmos-kit@1:core//repel-wallet',
      value.toString()
    );
  }

  addChains = (
    chains: Chain[],
    assetLists: AssetList[],
    signerOptions?: SignerOptions,
    endpoints?: EndpointOptions['endpoints']
  ) => {
    const newChainRecords = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpoints?.[chain.chain_name],
        this.isLazy,
        this.logger
      )
    );
    newChainRecords.forEach((chainRecord) => {
      const index = this.chainRecords.findIndex(
        (chainRecord2) => chainRecord2.name !== chainRecord.name
      );
      if (index == -1) {
        this.chainRecords.push(chainRecord);
      } else {
        this.chainRecords[index] = chainRecord;
      }
    });

    this.mainWallets.forEach((wallet) => {
      wallet.setChains(newChainRecords, false);
    });

    newChainRecords.forEach((chainRecord) => {
      const repo = new WalletRepo(
        chainRecord,
        this.mainWallets.map(
          ({ getChainWallet }) => getChainWallet(chainRecord.name)!
        )
      );
      repo.setActions({
        viewOpen: this.actions?.viewOpen,
        viewWalletRepo: this.actions?.viewWalletRepo,
      });
      repo.wallets.forEach((w) => {
        w.setActions({
          data: this.actions?.data,
          state: this.actions?.state,
          message: this.actions?.message,
        });
      });
      repo.logger = this.logger;
      repo.repelWallet = this.repelWallet;
      repo.session = this.session;

      const index = this.walletRepos.findIndex(
        (repo2) => repo2.chainName !== repo.chainName
      );
      if (index == -1) {
        this.walletRepos.push(repo);
      } else {
        this.walletRepos[index] = repo;
      }
    });
  };

  on = (event: EventName, handler: (params: any) => void) => {
    this.coreEmitter.on(event, handler);
  };

  off = (event: EventName, handler: (params: any) => void) => {
    this.coreEmitter.off(event, handler);
  };

  get activeRepos(): WalletRepo[] {
    return this.walletRepos.filter((repo) => repo.isActive === true);
  }

  getMainWallet = (walletName: WalletName): MainWalletBase => {
    const wallet = this.mainWallets.find((w) => w.walletName === walletName);

    if (!wallet) {
      throw new Error(`Wallet ${walletName} is not provided.`);
    }

    return wallet;
  };

  getWalletRepo = (chainName: ChainName): WalletRepo => {
    const walletRepo = this.walletRepos.find(
      (wr) => wr.chainName === chainName
    );

    if (!walletRepo) {
      throw new Error(`Chain ${chainName} is not provided.`);
    }

    return walletRepo;
  };

  getChainWallet = (
    chainName: ChainName,
    walletName: WalletName
  ): ChainWalletBase => {
    const chainWallet: ChainWalletBase | undefined = this.getMainWallet(
      walletName
    ).getChainWallet(chainName);

    if (!chainWallet) {
      throw new Error(`${chainName} is not provided!`);
    }
    return chainWallet;
  };

  getChainRecord = (chainName: ChainName): ChainRecord => {
    const chainRecord: ChainRecord | undefined = this.chainRecords.find(
      (c) => c.name === chainName
    );

    if (!chainRecord) {
      throw new Error(`${chainName} is not provided!`);
    }
    return chainRecord;
  };

  // get chain logo
  getChainLogo = (chainName: ChainName): string | undefined => {
    const chainRecord = this.getChainRecord(chainName);
    return (
      // until chain_registry fix this
      // chainRecord?.chain.logo_URIs?.svg ||
      // chainRecord?.chain.logo_URIs?.png ||
      // chainRecord?.chain.logo_URIs?.jpeg ||
      chainRecord?.assetList?.assets[0]?.logo_URIs?.svg ||
      chainRecord?.assetList?.assets[0]?.logo_URIs?.png ||
      undefined
    );
  };

  getNameService = async (chainName?: ChainName): Promise<NameService> => {
    let _chainName: ChainName;
    if (!chainName) {
      if (!this.defaultNameService) {
        throw new Error('defaultNameService is undefined');
      }
      const registry = getNameServiceRegistryFromName(this.defaultNameService);
      if (!registry) {
        throw new Error(
          'Unknown defaultNameService ' + this.defaultNameService
        );
      }
      _chainName = registry.chainName;
    } else {
      _chainName = chainName;
    }

    return await this.getWalletRepo(_chainName).getNameService();
  };

  private _reconnect = async () => {
    this.logger?.debug('[CORE EVENT] Emit `refresh_connection`');
    this.coreEmitter.emit('refresh_connection');
    const walletName = window.localStorage.getItem(
      'cosmos-kit@1:core//current-wallet'
    );
    if (walletName) {
      this.getMainWallet(walletName).getChainWalletList(true)[0]?.connect(true);
    }
  };

  private _restoreAccounts = async () => {
    const walletName = window.localStorage.getItem(
      'cosmos-kit@1:core//current-wallet'
    );
    const accountsStr = window.localStorage.getItem(
      'cosmos-kit@1:core//accounts'
    );
    if (walletName && accountsStr) {
      const accounts: SimpleAccount[] = JSON.parse(accountsStr);
      accounts.forEach((data) => {
        const mainWallet = this.getMainWallet(walletName);
        mainWallet.activate();
        const chainWallet = mainWallet
          .getChainWalletList(false)
          .find(
            (w) =>
              w.chainRecord.chain.chain_id === data.chainId &&
              w.namespace === data.namespace
          );
        chainWallet?.setData(data);
        chainWallet?.setState(State.Done);
      });
    }
    if (walletName) {
      await this._reconnect();
    }
  };

  onMounted = async () => {
    if (typeof window === 'undefined') return;

    this._restoreAccounts();

    const parser = Bowser.getParser(window.navigator.userAgent);
    const env = {
      browser: parser.getBrowserName(true),
      device: (parser.getPlatform().type || 'desktop') as DeviceType,
      os: parser.getOSName(true) as OS,
    };
    this.setEnv(env);
    this.walletRepos.forEach((repo) => repo.setEnv(env));

    this.mainWallets.forEach(async (wallet) => {
      wallet.setEnv(env);
      wallet.emitter?.emit('broadcast_env', env);

      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.addEventListener(eventName, this._reconnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          wallet.client?.on?.(eventName, this._reconnect);
        }
      );

      if (wallet.walletInfo.mode === 'wallet-connect') {
        await wallet.initClient(this.walletConnectOptions);
        wallet.emitter?.emit('broadcast_client', wallet.client);
        this.logger?.debug('[WALLET EVENT] Emit `broadcast_client`');
      } else {
        await wallet.initClient();
        wallet.emitter?.emit('broadcast_client', wallet.client);
        this.logger?.debug('[WALLET EVENT] Emit `broadcast_client`');
      }
    });
  };

  onUnmounted = () => {
    if (typeof window === 'undefined') {
      return;
    }
    this.mainWallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.removeEventListener(eventName, this._reconnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          wallet.client?.off?.(eventName, this._reconnect);
        }
      );
    });
  };
}

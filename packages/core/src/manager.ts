import { AssetList, Chain } from '@chain-registry/types';
import Bowser from 'bowser';
import EventEmitter from 'events';

import { MainWalletBase, StateBase } from './bases';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import {
  ChainName,
  ChainRecord,
  DeviceType,
  EndpointOptions,
  NameServiceName,
  OS,
  SessionOptions,
  SignerOptions,
  SimpleAccount,
  State,
  WalletConnectOptions,
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
  private _wallets: MainWalletBase[] = [];
  coreEmitter: EventEmitter;

  readonly sessionOptions: SessionOptions = {
    duration: 1800000,
    callback: () =>
      window?.localStorage.removeItem('cosmos-kit@1:core//accounts'),
  };
  walletConnectOptions?: WalletConnectOptions;
  readonly session: Session;

  constructor(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: MainWalletBase[],
    logger: Logger,
    defaultNameService?: NameServiceName,
    walletConnectOptions?: WalletConnectOptions,
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    this.coreEmitter = new EventEmitter();
    this.logger = logger;
    if (defaultNameService) this.defaultNameService = defaultNameService;
    if (sessionOptions) this.sessionOptions = sessionOptions;
    this.session = new Session(this.sessionOptions);
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

    this.chainRecords = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpointOptions?.[chain.chain_name]
      )
    );

    this._wallets = wallets.map((wallet) => {
      wallet.logger = this.logger;
      wallet.session = this.session;
      wallet.walletConnectOptions = this.walletConnectOptions;
      wallet.setChains(this.chainRecords);
      return wallet;
    });

    this.chainRecords.forEach((chainRecord) => {
      const repo = new WalletRepo(
        chainRecord,
        wallets.map(({ getChainWallet }) => getChainWallet(chainRecord.name)!),
        this.sessionOptions
      );
      repo.logger = this.logger;
      this.walletRepos.push(repo);
    });
  }

  addChains = (
    chains: Chain[],
    assetLists: AssetList[],
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions
  ) => {
    const newChainRecords = chains.map((chain) =>
      convertChain(
        chain,
        assetLists,
        signerOptions,
        endpointOptions?.[chain.chain_name]
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

    this._wallets.forEach((wallet) => {
      wallet.setChains(newChainRecords, false);
    });

    const newWalletRepos = newChainRecords.map((chainRecord) => {
      return new WalletRepo(
        chainRecord,
        this._wallets.map(
          ({ getChainWallet }) => getChainWallet(chainRecord.name)!
        ),
        this.sessionOptions
      );
    });

    newWalletRepos.forEach((repo) => {
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

  on(event: string, handler: (params: any) => void) {
    this.coreEmitter.on(event, handler);
  }

  off(event: string, handler: (params: any) => void) {
    this.coreEmitter.off(event, handler);
  }

  get activeRepos(): WalletRepo[] {
    return this.walletRepos.filter((repo) => repo.isActive === true);
  }

  getWalletRepo = (chainName: ChainName): WalletRepo => {
    const walletRepo = this.walletRepos.find(
      (wr) => wr.chainName === chainName
    );

    if (!walletRepo) {
      throw new Error(`Chain ${chainName} is not provided.`);
    }

    return walletRepo;
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

  private _handleConnect = async () => {
    this.logger?.info('[CORE EVENT] Emit `refresh_connection`');
    this.coreEmitter.emit('refresh_connection');
    const walletName = window.localStorage.getItem(
      'cosmos-kit@1:core//current-wallet'
    );
    if (walletName) {
      await this.activeRepos[0]?.connect(walletName);
    }
  };

  private _restoreAccounts = async () => {
    const walletName = window.localStorage.getItem(
      'cosmos-kit@1:core//current-wallet'
    );
    const accountsStr = window.localStorage.getItem(
      'cosmos-kit@1:core//accounts'
    );
    if (accountsStr) {
      const accounts: SimpleAccount[] = JSON.parse(accountsStr);
      accounts.forEach((data) => {
        if (data.namespace !== 'cosmos') return;

        const chainWallet = this.walletRepos
          .find((repo) => repo.chainRecord.chain.chain_id === data.chainId)
          ?.wallets.find((cw) => cw.walletName === walletName);

        chainWallet?.setData(data);
        chainWallet?.setState(State.Done);
      });
    }
  };

  onMounted = async () => {
    if (typeof window === 'undefined') return;

    this._restoreAccounts();

    this._wallets.forEach(async (wallet) => {
      if (wallet.walletInfo.mode === 'wallet-connect') {
        await wallet.initClient(this.walletConnectOptions);
        wallet.emitter?.emit('broadcast_client', wallet.client);
        this.logger?.info('[WALLET EVENT] Emit `broadcast_client`');
      } else {
        await wallet.initClient();
        wallet.emitter?.emit('broadcast_client', wallet.client);
        this.logger?.info('[WALLET EVENT] Emit `broadcast_client`');
      }
    });

    const parser = Bowser.getParser(window.navigator.userAgent);
    const env = {
      browser: parser.getBrowserName(true),
      device: (parser.getPlatform().type || 'desktop') as DeviceType,
      os: parser.getOSName(true) as OS,
    };
    this.setEnv(env);
    this.walletRepos.forEach((repo) => repo.setEnv(env));

    this._wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.addEventListener(eventName, this._handleConnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          wallet.client?.on?.(eventName, this._handleConnect);
        }
      );
    });

    this.actions?.viewOpen?.(false);
  };

  onUnmounted = () => {
    if (typeof window === 'undefined') {
      return;
    }
    this._wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.removeEventListener(eventName, this._handleConnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          wallet.client?.off?.(eventName, this._handleConnect);
        }
      );
    });
  };
}

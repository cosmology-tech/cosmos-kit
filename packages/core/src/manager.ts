/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import { SignClientTypes } from '@walletconnect/types';
import Bowser from 'bowser';

import { MainWalletBase, StateBase } from './bases';
import { nameServiceRegistries } from './config';
import { NameService } from './name-service';
import { WalletRepo } from './repository';
import {
  ChainName,
  ChainRecord,
  Data,
  DeviceType,
  EndpointOptions,
  NameServiceName,
  OS,
  SessionOptions,
  SignerOptions,
} from './types';
import { convertChain, getNameServiceRegistryFromName } from './utils';

export class WalletManager extends StateBase<Data> {
  chainRecords: ChainRecord[] = [];
  walletRepos: WalletRepo[] = [];
  defaultNameService: NameServiceName = 'icns';
  private _wallets: MainWalletBase[] = [];
  options = {
    synchroMutexWallet: true,
  };

  sessionOptions: SessionOptions = {
    duration: 1800000,
    killOnTabClose: false,
  };

  constructor(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: MainWalletBase[],
    defaultNameService?: NameServiceName,
    wcSignClientOptions?: SignClientTypes.Options,
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    if (defaultNameService) {
      this.defaultNameService = defaultNameService;
    }
    this.sessionOptions = { ...this.sessionOptions, ...sessionOptions };
    this.init(
      chains,
      assetLists,
      wallets,
      wcSignClientOptions,
      signerOptions,
      endpointOptions
    );
  }

  private synchroMutexWallet() {
    this._wallets.forEach(({ chainWallets }) => {
      chainWallets?.forEach((w) => {
        w.updateCallbacks({
          afterDisconnect: async () => {
            chainWallets.forEach(async (w2) => {
              if (!w2.isWalletDisconnected && w2 !== w) {
                await w2.disconnect();
              }
            });
          },
          afterConnect: async () => {
            this.synchronizeMutexWalletConnection();
          },
        });
      });
    });
  }

  init(
    chains: Chain[],
    assetLists: AssetList[],
    wallets: MainWalletBase[],
    wcSignClientOptions?: SignClientTypes.Options,
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions
  ) {
    console.info(
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
      if ((wallet as any).setWCSignClientOptions) {
        (wallet as any).setWCSignClientOptions(wcSignClientOptions);
      }
      wallet.setChains(this.chainRecords);
      return wallet;
    });

    if (this.options.synchroMutexWallet) {
      this.synchroMutexWallet();
    }

    this.chainRecords.forEach((chainRecord) => {
      this.walletRepos.push(
        new WalletRepo(
          chainRecord,
          wallets.map(
            ({ getChainWallet }) => getChainWallet(chainRecord.name)!
          ),
          this.sessionOptions
        )
      );
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

    if (this.options.synchroMutexWallet) {
      this.synchroMutexWallet();
    }

    const newWalletRepos = newChainRecords.map((chainRecord) => {
      return new WalletRepo(
        chainRecord,
        this._wallets.map(
          ({ getChainWallet }) => getChainWallet(chainRecord.name)!
        ),
        this.sessionOptions
      );
    });

    newWalletRepos.forEach((wr) => {
      wr.setActions({
        viewOpen: this.actions?.viewOpen,
        viewWalletRepo: this.actions?.viewWalletRepo,
      });
      wr.wallets.forEach((w) => {
        w.setActions({
          data: this.actions?.data,
          state: this.actions?.state,
          message: this.actions?.message,
        });
      });

      const index = this.walletRepos.findIndex(
        (wr2) => wr2.chainName !== wr.chainName
      );
      if (index == -1) {
        this.walletRepos.push(wr);
      } else {
        this.walletRepos[index] = wr;
      }
    });
  };

  get walletReposInUse(): WalletRepo[] {
    return this.walletRepos.filter((repo) => repo.isInUse === true);
  }

  async synchronizeMutexWalletConnection() {
    if (typeof window === 'undefined') {
      return;
    }
    const ls = window.localStorage;
    if (ls.getItem('synchronize-mutex-wallet') === 'done') {
      return;
    }
    ls.setItem('synchronize-mutex-wallet', 'done');
    const walletName = ls.getItem('chain-provider');
    for (const repo of this.walletReposInUse) {
      if (walletName) {
        if (repo.current?.walletName !== walletName) {
          await repo.current?.disconnect();
        }
        await repo.connect(walletName);
      }
    }
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
    const ls = window.localStorage;
    const walletName = ls.getItem('chain-provider');
    if (walletName) {
      ls.setItem('synchronize-mutex-wallet', 'fire');
      await this.walletReposInUse[0]?.connect(walletName);
    }
  };

  onMounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    this._handleConnect();

    const parser = Bowser.getParser(window.navigator.userAgent);
    const env = {
      browser: parser.getBrowserName(true),
      device: (parser.getPlatform().type || 'desktop') as DeviceType,
      os: parser.getOSName(true) as OS,
    };
    this.setEnv(env);
    this.walletRepos.forEach((repo) => repo.setEnv(env));

    this.walletRepos[0]?.wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.addEventListener(eventName, this._handleConnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          (wallet.client || (await wallet.clientPromise))?.on?.(
            eventName,
            this._handleConnect
          );
        }
      );
    });
  };

  onUnmounted = () => {
    if (typeof window === 'undefined') {
      return;
    }
    this.walletRepos[0]?.wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
        window.removeEventListener(eventName, this._handleConnect);
      });
      wallet.walletInfo.connectEventNamesOnClient?.forEach(
        async (eventName) => {
          (wallet.client || (await wallet.clientPromise))?.off?.(
            eventName,
            this._handleConnect
          );
        }
      );
    });
  };
}

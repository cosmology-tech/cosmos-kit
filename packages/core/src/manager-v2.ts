/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import Bowser from 'bowser';

import { MainWalletBase, StateBase } from './bases';
import { WalletRepo } from './repository';
import {
  ChainName,
  ChainRecord,
  Data,
  DeviceType,
  EndpointOptions,
  OS,
  SessionOptions,
  SignerOptions,
} from './types';
import { convertChain } from './utils';

export class WalletManagerV2 extends StateBase<Data> {
  chainRecords: ChainRecord[] = [];
  walletRepos: WalletRepo[] = [];
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
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    this.sessionOptions = { ...this.sessionOptions, ...sessionOptions };

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
    wallets.forEach((wallet) => {
      wallet.setChains(this.chainRecords);
    });

    if (this.options.synchroMutexWallet) {
      wallets.forEach(({ chainWallets }) => {
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

    this.chainRecords.map((chainRecord) => {
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

  getChainRecord = (chainName?: ChainName): ChainRecord | undefined => {
    if (!chainName) {
      return void 0;
    }

    const chainRecord: ChainRecord | undefined = this.chainRecords.find(
      (c) => c.name === chainName
    );

    if (!chainRecord) {
      throw new Error(`${chainName} is not provided!`);
    }
    return chainRecord;
  };

  // get chain logo
  getChainLogo = (chainName?: ChainName): string | undefined => {
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

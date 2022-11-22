/* eslint-disable no-console */
import { AssetList, Chain } from '@chain-registry/types';
import Bowser from 'bowser';

import { ChainWalletBase, MainWalletBase, StateBase } from './bases';
import {
  ChainName,
  ChainRecord,
  Data,
  DeviceType,
  EndpointOptions,
  OS,
  SessionOptions,
  SignerOptions,
  ViewOptions,
  WalletName,
} from './types';
import { convertChain } from './utils';
import { WalletRepo } from './wallet-repo';

export class WalletManagerV2 extends StateBase<Data> {
  chainRecords: ChainRecord[] = [];
  allWallets: ChainWalletBase[] = [];

  chainToWalletHash: Map<ChainName, Map<WalletName, ChainWalletBase>>;
  walletToChainHash: Map<WalletName, Map<ChainName, ChainWalletBase>>;

  viewOptions: ViewOptions = {
    alwaysOpenView: false,
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
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
    viewOptions?: ViewOptions,
    endpointOptions?: EndpointOptions,
    sessionOptions?: SessionOptions
  ) {
    super();
    this.viewOptions = { ...this.viewOptions, ...viewOptions };
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

    this.chainToWalletHash = new Map(
      chains.map(({ chain_name }) => {
        return [
          chain_name,
          new Map(
            wallets.map(({ walletName, getChainWallet }) => {
              return [walletName, getChainWallet(chain_name)];
            })
          ),
        ];
      })
    );

    this.walletToChainHash = new Map(
      wallets.map(({ walletName, chainWallets }) => {
        return [walletName, chainWallets];
      })
    );

    wallets.forEach(({ chainWallets }) => {
      this.allWallets.push(...Array.from(chainWallets.values()));
    });
  }

  get wallets(): ChainWalletBase[] {
    if (this.isMobile) {
      return this.allWallets.filter(
        (wallet) => !wallet.walletInfo.mobileDisabled
      );
    }
    return this.allWallets;
  }

  getWalletRepo = (
    chainName?: ChainName,
    walletName?: WalletName
  ): WalletRepo => {
    if (chainName && !this.chainToWalletHash.has(chainName)) {
      throw new Error(`Chain ${chainName} is not provided.`);
    }

    if (walletName && !this.walletToChainHash.has(walletName)) {
      throw new Error(`Wallet ${chainName} is not provided.`);
    }

    if (chainName && walletName) {
      return new WalletRepo([
        this.chainToWalletHash.get(chainName).get(walletName),
      ]);
    }

    if (chainName) {
      return new WalletRepo(
        Array.from(this.chainToWalletHash.get(chainName).values())
      );
    }

    if (walletName) {
      return new WalletRepo(
        Array.from(this.walletToChainHash.get(walletName).values())
      );
    }

    return new WalletRepo(this.allWallets);
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

  connect = async (chainName?: ChainName, walletName?: WalletName) => {
    const wallet = this.getWalletRepo(chainName, walletName);
    wallet.setEnv(this.env);
    wallet.setActions(this.actions);
    await wallet.connect(this.sessionOptions);
  };

  disconnect = async (chainName?: ChainName, walletName?: WalletName) => {
    const wallet = this.getWalletRepo(chainName, walletName);
    wallet.setEnv(this.env);
    wallet.setActions(this.actions);
    await wallet.disconnect();
  };

  private _handleTabLoad = (event?: Event) => {
    event?.preventDefault();
    this.connect();
  };

  private _handleTabClose = (event: Event) => {
    event.preventDefault();
    if (this.sessionOptions.killOnTabClose || this.isWalletConnecting) {
      this.disconnect();
    }
  };

  private _connectEventLisener = async (event: Event) => {
    event.preventDefault();
    if (!this.isInit) {
      await this.connect();
    }
  };

  onMounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const parser = Bowser.getParser(window.navigator.userAgent);
    this.setEnv({
      browser: parser.getBrowserName(true),
      device: (parser.getPlatform().type || 'desktop') as DeviceType,
      os: parser.getOSName(true) as OS,
    });
  };

  onUnmounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener('beforeunload', this._handleTabClose);
    window.removeEventListener('load', this._handleTabLoad);

    this.wallets.forEach((wallet) => {
      wallet.walletInfo.connectEventNames?.forEach((eventName) => {
        window.removeEventListener(eventName, this._connectEventLisener);
      });
    });
  };
}

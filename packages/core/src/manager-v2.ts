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

    this.chainRecords.map((chainRecord) => {
      this.walletRepos.push(
        new WalletRepo(
          chainRecord,
          wallets.map(({ getChainWallet }) => getChainWallet(chainRecord.name)),
          this.sessionOptions
        )
      );
    });
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

  connect = async (chainName: ChainName) => {
    const repo = this.getWalletRepo(chainName);
    await repo.connect();
  };

  disconnect = async (chainName: ChainName) => {
    const repo = this.getWalletRepo(chainName);
    await repo.disconnect();
  };

  onMounted = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const parser = Bowser.getParser(window.navigator.userAgent);
    const env = {
      browser: parser.getBrowserName(true),
      device: (parser.getPlatform().type || 'desktop') as DeviceType,
      os: parser.getOSName(true) as OS,
    };
    this.setEnv(env);
    this.walletRepos.forEach((repo) => repo.setEnv(env));
  };

  onUnmounted = () => {};
}

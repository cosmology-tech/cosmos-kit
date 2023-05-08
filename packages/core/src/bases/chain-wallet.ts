import {
  AuthRange,
  ChainRecord,
  ExtendedHttpEndpoint,
  NameService,
  State,
  Wallet,
  WalletAccount,
} from '../types';
import { getIsLazy, getFastestEndpoint, isValidEndpoint } from '../utils';
import { WalletBase } from './wallet';

export abstract class ChainWalletBase extends WalletBase {
  protected _chainRecord: ChainRecord;
  rpcEndpoints: (string | ExtendedHttpEndpoint)[] = [];
  restEndpoints: (string | ExtendedHttpEndpoint)[] = [];
  protected _rpcEndpoint?: string | ExtendedHttpEndpoint;
  protected _restEndpoint?: string | ExtendedHttpEndpoint;
  isLazy?: boolean; // stands for real `chainIsLazy` considered both `globalIsLazy` and `chainIsLazy` settings

  constructor(walletInfo: Wallet, chainRecord: ChainRecord) {
    super(walletInfo);
    this._chainRecord = chainRecord;
    this.rpcEndpoints = chainRecord.preferredEndpoints?.rpc;
    this.restEndpoints = chainRecord.preferredEndpoints?.rest;
  }

  get chainRecord() {
    return this._chainRecord;
  }

  get namespace() {
    return this.chainRecord.namespace;
  }

  get chainName() {
    return this.chainRecord.name;
  }

  get chainLogoUrl(): string | undefined {
    return (
      // until chain_registry fix this
      // this.chainInfo.chain.logo_URIs?.svg ||
      // this.chainInfo.chain.logo_URIs?.png ||
      // this.chainInfo.chain.logo_URIs?.jpeg ||
      this.chainRecord.assetList?.assets[0]?.logo_URIs?.svg ||
      this.chainRecord.assetList?.assets[0]?.logo_URIs?.png ||
      undefined
    );
  }

  get chain() {
    return this.chainRecord.chain;
  }

  get assets() {
    return this.chainRecord.assetList?.assets;
  }

  get assetList() {
    return this.chainRecord.assetList;
  }

  get chainId() {
    return this.chain?.chain_id;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  setData(data: WalletAccount | undefined) {
    this._mutable.data = data;
    this.actions?.data?.(data);
    const accountsStr = window.localStorage.getItem(
      'cosmos-kit@1:core//accounts'
    );
    let accounts: WalletAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
    accounts = accounts.filter(
      (a) => a.chainId != this.chainId || a.namespace != this.namespace
    );
    if (typeof data !== 'undefined') {
      accounts.push(data);
    }
    window?.localStorage.setItem(
      'cosmos-kit@1:core//accounts',
      JSON.stringify(accounts)
    );
    this.session?.update();
  }

  initClient(_options?: any): void | Promise<void> {
    throw new Error('initClient not implemented');
  }

  async update() {
    this.setState(State.Pending);
    this.setMessage(void 0);

    const authRange: AuthRange = {
      [this.namespace]: { chainIds: [this.chainId] },
    };

    try {
      await this.client.enable?.(authRange);

      let account: WalletAccount;
      try {
        this.logger?.debug(
          `Fetching ${this.walletName} ${this.chainId} account.`
        );
        account = await this.client.getAccount(authRange)[0];
      } catch (error) {
        if (this.rejectMatched(error as Error)) {
          this.setRejected();
          return;
        }
        if (this.client.addChain) {
          await this.client.addChain(this.namespace, this.chainRecord);
          account = await this.client.getAccount(authRange)[0];
        } else {
          throw error;
        }
      }

      this.setData(account);
      this.setState(State.Done);
      this.setMessage(void 0);
    } catch (e) {
      this.logger?.error(e);
      if (e && this.rejectMatched(e as Error)) {
        this.setRejected();
      } else {
        this.setError(e as Error);
      }
    }
    if (!this.isWalletRejected) {
      window?.localStorage.setItem(
        'cosmos-kit@1:core//current-wallet',
        this.walletName
      );
    }
  }

  getRpcEndpoint = async (
    isLazy?: boolean
  ): Promise<string | ExtendedHttpEndpoint> => {
    const lazy = getIsLazy(
      void 0,
      this.isLazy,
      (this._rpcEndpoint as any)?.isLazy,
      isLazy,
      this.logger
    );

    if (lazy) {
      const endpoint = this._rpcEndpoint || this.rpcEndpoints[0];
      if (!endpoint) {
        return Promise.reject('No endpoint available.');
      }
      return endpoint;
    }

    if (
      this._rpcEndpoint &&
      (await isValidEndpoint(this._rpcEndpoint, lazy, this.logger))
    ) {
      return this._rpcEndpoint;
    }

    this._rpcEndpoint = await getFastestEndpoint(
      this.rpcEndpoints,
      this.logger
    );
    return this._rpcEndpoint;
  };

  getRestEndpoint = async (
    isLazy?: boolean
  ): Promise<string | ExtendedHttpEndpoint> => {
    const lazy = getIsLazy(
      void 0,
      this.isLazy,
      (this._restEndpoint as any).isLazy,
      isLazy,
      this.logger
    );

    if (lazy) {
      const endpoint = this._restEndpoint || this.restEndpoints[0];
      if (!endpoint) {
        return Promise.reject('No endpoint available.');
      }
      return endpoint;
    }

    if (
      this._restEndpoint &&
      (await isValidEndpoint(this._restEndpoint, lazy, this.logger))
    ) {
      return this._restEndpoint;
    }

    this._restEndpoint = await getFastestEndpoint(
      this.restEndpoints,
      this.logger
    );
    return this._restEndpoint;
  };

  abstract getNameService: () => Promise<NameService>;
  abstract sign: (...params: any) => Promise<any>;
  abstract broadcast: (...params: any) => Promise<any>;
}

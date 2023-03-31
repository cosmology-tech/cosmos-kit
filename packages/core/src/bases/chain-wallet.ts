import {
  ChainRecord,
  ExtendedHttpEndpoint,
  Namespace,
  SimpleAccount,
  State,
  Wallet,
} from '../types';
import { getIsLazy, getFastestEndpoint, isValidEndpoint } from '../utils';
import { WalletBase } from './wallet';

export class ChainWalletBase extends WalletBase {
  protected _chainRecord: ChainRecord;
  rpcEndpoints: (string | ExtendedHttpEndpoint)[] = [];
  restEndpoints: (string | ExtendedHttpEndpoint)[] = [];
  protected _rpcEndpoint?: string | ExtendedHttpEndpoint;
  protected _restEndpoint?: string | ExtendedHttpEndpoint;
  namespace?: Namespace;
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

  get cosmwasmEnabled() {
    return this.chain?.codebase?.cosmwasm_enabled;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  setData(data: SimpleAccount | undefined) {
    this._mutable.data = data;
    this.actions?.data?.(data);
    const accountsStr = window.localStorage.getItem(
      'cosmos-kit@1:core//accounts'
    );
    let accounts: SimpleAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
    if (typeof data === 'undefined') {
      accounts = accounts.filter(
        (a) => a.chainId !== this.chainId || a.namespace !== this.namespace
      );
    } else {
      accounts = accounts.filter(
        (a) => a.chainId !== this.chainId || a.namespace !== this.namespace
      );
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

    try {
      await this.client.connect?.(this.chainId);

      let account: SimpleAccount;
      try {
        this.logger?.debug(
          `Fetching ${this.walletName} ${this.chainId} account.`
        );
        account = await this.client.getSimpleAccount(this.chainId);
      } catch (error) {
        if (this.rejectMatched(error as Error)) {
          this.setRejected();
          return;
        }
        if (this.client.addChain) {
          await this.client.addChain(this.chainRecord);
          account = await this.client.getSimpleAccount(this.chainId);
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
}

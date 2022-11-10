/* eslint-disable no-console */
import {
  AppEnv,
  Callbacks,
  SessionOptions,
  State,
  Wallet,
  WalletClient,
} from '../types';
import { ClientNotExistError, RejectedError } from '../utils';
import { StateBase } from './state';

export abstract class WalletBase<Data> extends StateBase<Data> {
  clientPromise?: WalletClient | Promise<WalletClient | undefined>;
  client?: WalletClient;
  protected _walletInfo: Wallet;
  protected _env?: AppEnv;
  protected _appUrl?: string;
  protected _qrUrl?: string;

  constructor(walletInfo: Wallet) {
    super();
    this._walletInfo = walletInfo;
  }

  get walletInfo(): Wallet {
    return this._walletInfo;
  }

  get walletName() {
    return this.walletInfo.name;
  }

  get walletPrettyName() {
    return this.walletInfo.prettyName;
  }

  get appUrl(): string | undefined {
    return this._appUrl;
  }

  get qrUrl(): string | undefined {
    return this._qrUrl;
  }

  get env() {
    return this._env;
  }

  setEnv(env?: AppEnv) {
    this._env = env;
  }

  disconnect(callbacks?: Callbacks) {
    this.reset();
    callbacks?.disconnect?.();
  }

  setClientNotExist() {
    this.setState(State.Error);
    this.setMessage(ClientNotExistError.message);
  }

  setRejected() {
    this.setState(State.Error);
    this.setMessage(RejectedError.message);
  }

  setError(e: Error | string) {
    this.setState(State.Error);
    this.setMessage(typeof e === 'string' ? e : e.message);
    if (typeof e !== 'string' && e.stack) {
      console.error(e.stack);
    }
  }

  async connect(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    if (this.env?.isMobile && this.walletInfo.mobileDisabled) {
      this.setError(
        'This wallet is not supported on mobile, please use desktop browsers.'
      );
      return;
    }

    try {
      this.client =
        this.client || (await this.clientPromise) || (await this.fetchClient());

      if (!this.client) {
        this.setClientNotExist();
        return;
      }

      await this.update();

      if (sessionOptions?.duration) {
        setTimeout(() => {
          this.disconnect(callbacks);
        }, sessionOptions?.duration);
      }
    } catch (error) {
      this.setError(error as Error);
    }

    callbacks?.connect?.();
  }

  abstract fetchClient():
    | WalletClient
    | undefined
    | Promise<WalletClient | undefined>;

  abstract update(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): void | Promise<void>;
}

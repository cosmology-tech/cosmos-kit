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
  protected _qrUri?: string;

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

  get qrUri() {
    return this._qrUri;
  }

  get env() {
    return this._env;
  }

  setEnv(env: AppEnv) {
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
  }

  async connect(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    if (this.env?.isMobile && this.walletInfo.mobileDisabled) {
      this.setError(
        'This wallet is not supported on mobile, please use desktop browsers.'
      );
      return;
    }

    if (!this.client) {
      const client = await this.clientPromise;

      if (!client) {
        this.setClientNotExist();
        return;
      } else {
        this.client = client;
      }
    }

    await this.update();

    if (sessionOptions?.duration) {
      setTimeout(() => {
        this.disconnect();
      }, sessionOptions?.duration);
    }
    callbacks?.connect?.();
  }

  abstract update(): void | Promise<void>;
}

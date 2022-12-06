/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Callbacks,
  DownloadInfo,
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
  protected _appUrl?: string;
  protected _qrUrl?: string;
  callbacks?: Callbacks;

  constructor(walletInfo: Wallet) {
    super();
    this._walletInfo = walletInfo;
  }

  get walletInfo(): Wallet {
    return this._walletInfo;
  }

  get downloadInfo(): DownloadInfo | undefined {
    let downloads: DownloadInfo[] = this.walletInfo.downloads || [];

    downloads = downloads.filter(
      (d) => d.device === this.env?.device || !d.device
    );

    if (downloads.length === 1) {
      return downloads[0];
    }

    downloads = downloads.filter((d) => d.os === this.env?.os || !d.os);

    if (downloads.length === 1) {
      return downloads[0];
    }

    downloads = downloads.filter(
      (d) => d.browser === this.env?.browser || !d.browser
    );

    return downloads[0];
  }

  get walletName() {
    return this.walletInfo.name;
  }

  get walletPrettyName() {
    return this.walletInfo.prettyName;
  }

  get rejectMessageSource() {
    if (typeof this.walletInfo.rejectMessage === 'string') {
      return this.walletInfo.rejectMessage;
    } else {
      return this.walletInfo.rejectMessage?.source;
    }
  }

  get rejectMessageTarget() {
    if (typeof this.walletInfo.rejectMessage === 'string') {
      return void 0;
    } else {
      return this.walletInfo.rejectMessage?.target;
    }
  }

  get rejectCode() {
    return this.walletInfo.rejectCode;
  }

  rejectMatched(e: Error) {
    return (
      (this.rejectMessageSource && e.message === this.rejectMessageSource) ||
      (this.rejectCode && (e as any).code === this.rejectCode)
    );
  }

  get appUrl(): string | undefined {
    return this._appUrl;
  }

  get qrUrl(): string | undefined {
    return this._qrUrl;
  }

  updateCallbacks(callbacks: Callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  disconnect = async (callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    this.reset();
    window.localStorage.removeItem('chain-provider');
    await this.client?.disconnect?.();
    await (callbacks || this.callbacks)?.afterDisconnect?.();
  };

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

  connect = async (sessionOptions?: SessionOptions, callbacks?: Callbacks) => {
    await (callbacks || this.callbacks)?.beforeConnect?.();

    if (this.isMobile && this.walletInfo.mobileDisabled) {
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

    await (callbacks || this.callbacks)?.afterConnect?.();
  };

  abstract fetchClient():
    | WalletClient
    | undefined
    | Promise<WalletClient | undefined>;

  abstract update(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): void | Promise<void>;
}

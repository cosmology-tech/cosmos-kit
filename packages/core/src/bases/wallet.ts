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
import EventEmitter from 'events';

export abstract class WalletBase<Data> extends StateBase<Data> {
  client?: WalletClient;
  emitter?: EventEmitter;
  protected _walletInfo: Wallet;
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

  updateCallbacks(callbacks: Callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  disconnect = async (callbacks?: Callbacks, sync?: boolean) => {
    if (sync) {
      this.emitter?.emit('sync_disconnect', (this as any).chainName);
    }
    await (callbacks || this.callbacks)?.beforeDisconnect?.();
    this.reset();
    window.localStorage.removeItem('current-wallet-name');
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

  setError(e?: Error | string) {
    this.setState(State.Error);
    this.setMessage(typeof e === 'string' ? e : e?.message);
    if (typeof e !== 'string' && e?.stack) {
      this.logger?.error(e.stack);
    }
  }

  connect = async (
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks,
    sync?: boolean
  ) => {
    if (sync) {
      this.emitter?.emit('sync_connect', (this as any).chainName);
    }

    await (callbacks || this.callbacks)?.beforeConnect?.();

    if (this.isMobile && this.walletInfo.mobileDisabled) {
      this.setError(
        'This wallet is not supported on mobile, please use desktop browsers.'
      );
      return;
    }

    try {
      if (!this.client) {
        this.setClientNotExist();
        return;
      }

      this.emitter.emit('broadcast_client', this.client);
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

  abstract initClient(options?: any): void | Promise<void>;

  abstract update(
    sessionOptions?: SessionOptions,
    callbacks?: Callbacks
  ): void | Promise<void>;
}

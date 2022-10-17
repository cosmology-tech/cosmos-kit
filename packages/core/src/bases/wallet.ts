import { Callbacks, SessionOptions, State, Wallet } from '../types';
import { ClientNotExistError } from '../utils';
import { StateBase } from './state';

export abstract class WalletBase<Client, Data> extends StateBase<Data> {
  protected _client?: Client;
  protected _walletInfo: Wallet;

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

  get client() {
    return this._client;
  }

  disconnect(callbacks?: Callbacks) {
    this.reset();
    callbacks?.disconnect?.();
  }

  setClientNotExist() {
    this.setState(State.Error);
    this.setMessage(ClientNotExistError.message);
  }

  async connect(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    if (!this.client) {
      try {
        this._client = await this.fetchClient();
      } catch (error) {
        this.setClientNotExist();
        return;
      }
    }

    if (!this.client) {
      this.setClientNotExist();
      return;
    }

    await this.update();

    if (sessionOptions?.duration) {
      setTimeout(() => {
        this.disconnect();
      }, sessionOptions?.duration);
    }
    callbacks?.connect?.();
  }

  abstract fetchClient(): Client | Promise<Client>;
  abstract update(): void | Promise<void>;
}

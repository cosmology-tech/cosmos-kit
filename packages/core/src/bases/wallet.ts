import { Callbacks, SessionOptions, State, Wallet } from '../types';
import { ClientNoExistError } from '../utils';
import { StateBase } from './state';

export abstract class WalletBase<Client, Data> extends StateBase<Data> {
  constructor() {
    super();
  }

  get walletName() {
    return this.walletInfo.name;
  }

  disconnect(callbacks?: Callbacks) {
    this.reset();
    callbacks?.disconnect?.();
  }

  async connect(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    if (!this.client) {
      this.setState(State.Error);
      this.setMessage(ClientNoExistError.message);
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

  abstract get walletInfo(): Wallet;
  abstract get client(): Client | undefined | Promise<Client | undefined>;
}

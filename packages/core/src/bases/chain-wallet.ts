import { ChainRegistry, ChainWalletData, State } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  A,
  B extends ChainWalletData,
  C
> extends StateBase<B> {
  protected _chainRegistry: ChainRegistry;
  protected mainWallet?: C;

  constructor(_chainRegistry: ChainRegistry, mainWallet?: C) {
    super();
    this._chainRegistry = _chainRegistry;
    this.mainWallet = mainWallet;
  }

  get chainRegistry() {
    return this._chainRegistry;
  }

  get chainName() {
    return this.chainRegistry.name;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  disconnect() {
    this.reset();
  }

  async connect() {
    if (!await this.client) {
      this.setState(State.Error);
      this.setMessage("Client Not Exist!");
      return
    }
    await this.update();
  }

  abstract get client(): Promise<A> | undefined | A;
}

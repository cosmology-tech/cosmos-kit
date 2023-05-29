import {
  Discriminators,
  Raw,
  WalletClientOptions,
  Args,
  ReqArgs,
  WalletClientMethod,
  Resp,
  TypeParams,
  WalletClient,
  Namespace,
} from '../types';
import { getRequestArgsList, Logger } from '../utils';

export abstract class WalletClientBase<T extends TypeParams>
  implements WalletClient
{
  readonly discriminators?: Discriminators;
  readonly options?: WalletClientOptions;
  logger: Logger = new Logger('WARN');

  constructor(discriminators?: Discriminators, options?: WalletClientOptions) {
    this.discriminators = discriminators;
    this.options = options;
  }

  getMethods(namespace: Namespace, type: WalletClientMethod) {
    return Object.keys(this.discriminators?.[type]?.[namespace] || {});
  }

  protected abstract _request(args: ReqArgs): Promise<unknown>;

  protected async _applyGobalOptions(
    args: Args.General | Args.General[],
    type: WalletClientMethod
  ): Promise<Args.General | Args.General[]> {
    let _args: Args.General | Args.General[];
    if (Array.isArray(args)) {
      _args = args.map((argsItem) => ({
        ...argsItem,
        options: argsItem.options || this.options?.[type],
      }));
    } else {
      _args = {
        ...args,
        options: args.options || this.options?.[type],
      };
    }
    return _args;
  }

  protected async _getRawList(
    args: Args.General | Args.General[],
    type: WalletClientMethod
  ): Promise<Raw[]> {
    const _args = await this._applyGobalOptions(args, type);
    const reqArgsList = getRequestArgsList(
      this.discriminators?.[type],
      _args,
      this.logger
    );
    const rawList = await Promise.all(
      reqArgsList.map(async (reqArgs) => {
        return {
          method: reqArgs.method,
          resp: await this._request(reqArgs),
        };
      })
    );
    return rawList;
  }

  protected async _getRaw(
    args: Args.General | Args.General[],
    type: WalletClientMethod
  ): Promise<Raw> {
    const _args = await this._applyGobalOptions(args, type);
    const reqArgsList = getRequestArgsList(
      this.discriminators?.[type],
      _args,
      this.logger
    );
    if (reqArgsList.length > 1) {
      this.logger.warn(
        "Multiple methods fits the args. We'll only choose the first method for requesting."
      );
    }
    const resp = await this._request(reqArgsList[0]);
    return { method: reqArgsList[0].method, resp };
  }

  protected async _enable(args: Args.AuthRelated[]): Promise<Raw[]> {
    return this._getRawList(args, 'enable');
  }

  protected async _disable(args: Args.AuthRelated[]): Promise<Raw[]> {
    return this._getRawList(args, 'disable');
  }

  protected async _getAccount(args: Args.GetAccount): Promise<Raw[]> {
    return this._getRawList(args, 'getAccount');
  }

  protected async _addChain(args: Args.AddChain<T['addChain']>): Promise<Raw> {
    return this._getRaw(args, 'addChain');
  }

  protected async _switchChain(args: Args.SwitchChain): Promise<Raw> {
    return this._getRaw(args, 'switchChain');
  }

  protected async _sign(args: Args.DocRelated<T['sign']>): Promise<Raw> {
    return this._getRaw(args, 'sign');
  }

  protected async _verify(args: Args.DocRelated<T['verify']>): Promise<Raw> {
    return this._getRaw(args, 'verify');
  }

  protected async _broadcast(
    args: Args.DocRelated<T['broadcast']>
  ): Promise<Raw> {
    return this._getRaw(args, 'broadcast');
  }

  protected async _signAndBroadcast(
    args: Args.DocRelated<T['signAndBroadcast']>
  ): Promise<Raw> {
    return this._getRaw(args, 'signAndBroadcast');
  }

  async enable(args: Args.AuthRelated[]): Promise<Resp.Void> {
    return { raw: await this._enable(args) };
  }

  async disable(args: Args.AuthRelated[]): Promise<Resp.Void> {
    return { raw: await this._disable(args) };
  }

  async getAccount(args: Args.GetAccount): Promise<Resp.GetAccount> {
    return { raw: await this._getAccount(args) };
  }

  async addChain(args: Args.AddChain<T['addChain']>): Promise<Resp.Void> {
    return { raw: await this._addChain(args) };
  }

  async switchChain(args: Args.SwitchChain): Promise<Resp.Void> {
    return { raw: await this._switchChain(args) };
  }

  async sign(args: Args.DocRelated<T['sign']>): Promise<Resp.Sign> {
    return { raw: await this._sign(args) };
  }

  async verify(args: Args.DocRelated<T['verify']>): Promise<Resp.Verify> {
    return { raw: await this._verify(args) };
  }

  async broadcast(
    args: Args.DocRelated<T['broadcast']>
  ): Promise<Resp.Broadcast> {
    return { raw: await this._broadcast(args) };
  }

  async signAndBroadcast(
    args: Args.DocRelated<T['signAndBroadcast']>
  ): Promise<Resp.Broadcast> {
    return { raw: await this._signAndBroadcast(args) };
  }
}

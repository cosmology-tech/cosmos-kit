import {
  Discriminators,
  Dist,
  Method,
  Namespace,
  Raw,
  WalletClientOptions,
  NamespaceData,
} from '../types';
import { getMethod } from '../utils';

export abstract class WalletClientBase {
  readonly discriminators: Discriminators;
  readonly options?: WalletClientOptions;

  constructor(discriminators: Discriminators, options?: WalletClientOptions) {
    this.discriminators = discriminators;
    this.options = options;
  }

  protected abstract _request(
    namespace: Namespace,
    method: string,
    params: unknown,
    options?: Dist<Method>
  ): Promise<unknown>;

  protected async _enable(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.enableOptions;
    const method = getMethod(
      this.discriminators.enable,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }

  protected async _disable(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.disableOptions;
    const method = getMethod(
      this.discriminators.disable,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }

  protected async _sign(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.signOptions;
    const method = getMethod(
      this.discriminators.sign,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }

  protected async _verify(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.verifyOptions;
    const method = getMethod(
      this.discriminators.verify,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }

  protected async _broadcast(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.broadcastOptions;
    const method = getMethod(
      this.discriminators.sign,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }

  protected async _signAndBroadcast(
    args: NamespaceData<unknown, Dist<Method>>
  ): Promise<Raw> {
    const { namespace, data: params, options } = args;
    const _options = options || this.options?.signAndBroadcastOptions;
    const method = getMethod(
      this.discriminators.sign,
      namespace,
      params,
      _options
    );
    const resp = await this._request(namespace, method, params, _options);
    return { method, resp };
  }
}

import { ChainId } from '../chain';
import { Namespace } from './account';
import { RawMethod } from './discriminator';

/**
 * Distribute T among namespaces
 */
export type NamespaceMap<T> = {
  [k in Namespace]?: T;
};

export interface Options {
  /**
   * Defaults to false.
   *
   * When `allowMultipleRequests` is false, means will choose one method to call for a param data.
   * If there are multiple methods eligible from the raw wallet client, will only choose the first one.
   *
   * When `allowMultipleRequests` is true, means multiple requests could be made for a param data.
   *
   * For example, for WalletClient method `getAccount`, the original wallet object might provide two methods
   * to get address and public key separately.
   * If `allowMultipleRequests` is true, we'll do two request in `getAccount`, to get address and public key separately.
   * If `allowMultipleRequests` is false, we'll only do one request in `getAccount`, that is to get address.
   */
  allowMultipleRequests?: boolean;
  /**
   * Explicitly designate which methods to use in requesting from the raw wallet client.
   * Note that if you are setting `allowMultipleRequests` to be false, will only choose the first method.
   *
   * You can check the availble methods by calling `WalletClient.getMethods`.
   */
  methods?: RawMethod[];
}

/**
 * Arguments of methods in WalletClient
 */
export namespace Args {
  export interface Base {
    namespace: Namespace;
    params?: unknown;
    options?: Options;
  }
  export interface DocRelated<T> extends Base {
    params: T;
  }
  export interface AuthRelated extends Base {
    params?: {
      chainIds?: ChainId[];
      methods?: string[]; // Used in WalletConnect
      events?: string[]; // Used in WalletConnect
    };
  }
  export interface GetAccount<T> extends Base {
    params: T;
  }
  export interface AddChain<T> extends Base {
    params: {
      chainInfo: T;
    };
  }
  export interface SwitchChain extends Base {
    params: {
      chainId: ChainId;
    };
  }
}

export interface ReqArgs extends Args.Base {
  method: string;
}

/**
 * Type parameters in Args, used in WalletClientBase
 */
export interface TypeParams {
  addChain: unknown;
  sign: unknown;
  verify: unknown;
  broadcast: unknown;
  signAndBroadcast: unknown;
}

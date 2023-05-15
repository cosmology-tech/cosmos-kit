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
   * Defaults to false. When `greedy` is false, means will only request once per WalletClient method calling.
   * If there are multiple methods requesting eligible for original wallet object, will cause error.
   * When `greedy` is true, means multiple requests would be made per WalletClient method calling.
   *
   * For example, for WalletClient method `getAccount`, the original wallet object might provide two methods
   * to get address and public key separately.
   * If `greedy` is true, we'll do two request in `getAccount`, to get address and public key separately.
   * If `greedy` is false, we'll only do one request in `getAccount`, that is to get address.
   *
   * Note: Doc Related methods in WalletClient don't support multiple methods requesting.
   */
  greedy?: boolean;
  /**
   * Explicitly designate which method to use in requesting if there are multiple methods available in wallet.
   */
  method?: RawMethod;
}

/**
 * Arguments of methods in WalletClient
 */
export namespace Args {
  export interface General {
    namespace: Namespace;
    params?: unknown;
    options?: Options;
  }
  export interface DocRelated<T> extends General {
    params: T;
  }
  export interface AuthRelated extends General {
    params?: {
      chainIds?: ChainId[];
      methods?: string[]; // Used in WalletConnect
      events?: string[]; // Used in WalletConnect
    };
  }
  export interface GetAccount extends General {
    params: {
      chainId: ChainId | null;
    };
  }
  export interface AddChain<T> extends General {
    params: {
      chainInfo: T;
    };
  }
  export interface SwitchChain extends General {
    params: {
      chainId: ChainId;
    };
  }
}

export interface ReqArgs extends Args.General {
  method: string;
}

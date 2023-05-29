import { ChainName } from './chain';
import { Dispatch, HttpEndpoint, StateActions } from './common';
import { WalletMode, WalletName } from './wallet';
import { WalletClientOptions } from './wallet-client';

export interface WalletClientOptionsMap {
  [k: WalletName | WalletMode]: WalletClientOptions;
}

export interface SignerOptions {
  [k: string]: any;
}

export interface ViewOptions {
  alwaysOpenView?: boolean;
  closeViewWhenWalletIsConnected?: boolean;
  closeViewWhenWalletIsDisconnected?: boolean;
  closeViewWhenWalletIsRejected?: boolean;
}

export interface StorageOptions {
  disabled?: boolean;
  /**
   * Duration in ms.
   */
  duration?: number;
  clearOnTabClose?: boolean;
}

export interface SessionOptions {
  /**
   * Duration in ms.
   */
  duration: number;
  callback?: () => void;
}

export interface ExtendedHttpEndpoint extends HttpEndpoint {
  isLazy?: boolean;
}

export interface Endpoints {
  rpc?: (string | ExtendedHttpEndpoint)[];
  rest?: (string | ExtendedHttpEndpoint)[];
  isLazy?: boolean;
}

export interface EndpointOptions {
  isLazy?: boolean;
  endpoints?: Record<ChainName, Endpoints>;
}

export interface ManagerActions<T> extends StateActions<T> {
  walletName?: Dispatch<WalletName | undefined>;
  chainName?: Dispatch<ChainName | undefined>;
  viewOpen?: Dispatch<boolean>;
}

export type EventName = 'refresh_connection';

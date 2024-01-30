import { AssetList, Chain } from '@chain-registry/types';
import { CallbackOptions } from './wallet';

/* eslint-disable @typescript-eslint/no-explicit-any */
export enum State {
  Init = 'Init',
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

export interface Mutable<T> {
  state: State;
  data?: T;
  message?: string;
}

export type Dispatch<T> = (value: T) => void;

export interface Actions {
  [k: string]: Dispatch<any> | undefined;
}

export type Data = Record<string, any>;

export interface StateActions<T> extends Actions {
  state?: Dispatch<State>;
  data?: Dispatch<T | undefined>;
  message?: Dispatch<string | undefined>;
  clientState?: Dispatch<State>;
  clientMessage?: Dispatch<string | undefined>;
  render?: Dispatch<React.SetStateAction<number>>; // for cases that only provide chain name (rather than chain info), need time to fetch chain info
}

export interface WalletClientActions {
  qrUrl?: StateActions<string>;
  appUrl?: StateActions<string>;
}

export interface Callbacks {
  beforeConnect?: () => void;
  beforeDisconnect?: () => void;
  afterConnect?: () => void;
  afterDisconnect?: () => void;
}

export type OS = 'android' | 'ios' | 'windows' | 'macos';
export type BrowserName = 'chrome' | 'firefox' | 'safari' | string;
export type DeviceType = 'desktop' | 'mobile';

export interface DappEnv {
  device?: DeviceType;
  os?: OS;
  browser?: BrowserName;
}

export type CosmosClientType = 'stargate' | 'cosmwasm';
export type SignType = 'amino' | 'direct';

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';

export type ModalTheme = 'light' | 'dark';

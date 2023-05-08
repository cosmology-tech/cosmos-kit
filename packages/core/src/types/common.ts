import { ChainName } from './chain';
import { Namespace } from './wallet';

export type TypeName =
  | 'string'
  | 'number'
  | 'object'
  | 'symbol'
  | 'function'
  | 'bigint'
  | 'undefined'
  | 'boolean';

export type TypedArrayType =
  | 'Int8Array'
  | 'Uint8Array'
  | 'Uint8ClampedArray'
  | 'Int16Array'
  | 'Uint16Array'
  | 'Int32Array'
  | 'Uint32Array'
  | 'Float32Array'
  | 'Float64Array'
  | 'BigInt64Array'
  | 'BigUint64Array';

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

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type ModalTheme = 'light' | 'dark';

export type NameServiceName = string;

export interface NameService {
  resolveName: (address: string) => Promise<any>;
}

export interface NameServiceRegistry {
  name: NameServiceName;
  contract: string;
  chainName: ChainName;
  getQueryMsg: (address: string) => any;
  slip173: string;
}

export type Encoding = BufferEncoding | 'base58' | 'xdr';

export type EncodedString =
  | string
  | {
      value: string;
      encoding: Encoding;
    };

export type DiscriminatorMap = {
  /**
   * `object` here is a map from method name to its discriminator or a boolean value.
   *  Should be `Record<string, boolean | (params: unknown, options?: unknown) => boolean>`
   *  Here use `object` to make type `SignOptionsMap` being successfully generated.
   */
  [k in Namespace]?: object;
};

export type Discriminators = {
  [k in
    | 'sign'
    | 'verify'
    | 'broadcast'
    | 'signAndBroadcast']?: DiscriminatorMap;
};

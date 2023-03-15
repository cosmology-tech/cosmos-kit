export declare enum State {
    Init = "Init",
    Pending = "Pending",
    Done = "Done",
    Error = "Error"
}
export interface Mutable<T> {
    state: State;
    data?: T;
    message?: string;
}
export declare type Dispatch<T> = (value: T) => void;
export interface Actions {
    [k: string]: Dispatch<any> | undefined;
}
export declare type Data = Record<string, any>;
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
export declare type OS = 'android' | 'ios' | 'windows' | 'macos';
export declare type BrowserName = 'chrome' | 'firefox' | 'safari' | string;
export declare type DeviceType = 'desktop' | 'mobile';
export interface DappEnv {
    device?: DeviceType;
    os?: OS;
    browser?: BrowserName;
}
export declare type CosmosClientType = 'stargate' | 'cosmwasm';
export declare type SignType = 'amino' | 'direct';
export declare type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
export declare type ModalTheme = 'light' | 'dark';

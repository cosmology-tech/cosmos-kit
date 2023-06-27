declare enum State {
    Init = "Init",
    Pending = "Pending",
    Done = "Done",
    Error = "Error"
}
interface Mutable<T> {
    state: State;
    data?: T;
    message?: string;
}
declare type Dispatch<T> = (value: T) => void;
interface Actions {
    [k: string]: Dispatch<any> | undefined;
}
declare type Data = Record<string, any>;
interface StateActions<T> extends Actions {
    state?: Dispatch<State>;
    data?: Dispatch<T | undefined>;
    message?: Dispatch<string | undefined>;
}
interface WalletClientActions {
    qrUrl?: StateActions<string>;
    appUrl?: StateActions<string>;
}
interface Callbacks {
    beforeConnect?: () => void;
    beforeDisconnect?: () => void;
    afterConnect?: () => void;
    afterDisconnect?: () => void;
}
declare type OS = 'android' | 'ios' | 'windows' | 'macos';
declare type BrowserName = 'chrome' | 'firefox' | 'safari' | string;
declare type DeviceType = 'desktop' | 'mobile';
interface DappEnv {
    device?: DeviceType;
    os?: OS;
    browser?: BrowserName;
}
declare type CosmosClientType = 'stargate' | 'cosmwasm';
declare type SignType = 'amino' | 'direct';
declare type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
declare type ModalTheme = 'light' | 'dark';

export { Actions, BrowserName, Callbacks, CosmosClientType, DappEnv, Data, DeviceType, Dispatch, LogLevel, ModalTheme, Mutable, OS, SignType, State, StateActions, WalletClientActions };

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
export interface Data {
    [k: string]: any | undefined;
}
export interface Actions {
    [k: string]: Dispatch<any> | undefined;
}
export interface StateActions<T> extends Actions {
    state?: Dispatch<State>;
    data?: Dispatch<T | undefined>;
    message?: Dispatch<string | undefined>;
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
export interface AppEnv {
    device?: DeviceType;
    os?: OS;
    browser?: BrowserName;
}
export declare type ModalVersion = 'simple_v1' | 'simple_v2';
export declare type CosmosClientType = 'stargate' | 'cosmwasm';

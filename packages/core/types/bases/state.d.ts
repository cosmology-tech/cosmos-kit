import { Mutable, State, StateActions, WalletStatus } from '../types';
export declare class StateBase<Data> {
    protected _mutable: Mutable<Data>;
    actions?: StateActions<Data>;
    constructor();
    get emitState(): import("../types").Dispatch<State>;
    get emitData(): import("../types").Dispatch<Data>;
    get emitMessage(): import("../types").Dispatch<string>;
    get mutable(): Mutable<Data>;
    get state(): State;
    get isInit(): boolean;
    get isDone(): boolean;
    get isError(): boolean;
    get isPending(): boolean;
    get data(): Data;
    get message(): string;
    setState(state: State): void;
    setData(data: Data | undefined): void;
    setMessage(message: string | undefined): void;
    reset(): void;
    get walletStatus(): WalletStatus;
    get isWalletConnecting(): boolean;
    get isWalletConnected(): boolean;
    get isWalletDisconnected(): boolean;
    get isWalletRejected(): boolean;
    get isWalletNotExist(): boolean;
    get isWalletError(): boolean;
}

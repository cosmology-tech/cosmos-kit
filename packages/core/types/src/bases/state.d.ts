import { Mutable, State, StateActions, WalletStatus } from '../types';
export declare abstract class StateBase<T> {
    protected _mutable: Mutable<T>;
    actions?: StateActions<T>;
    constructor();
    get emitState(): import("../types").Dispatch<State>;
    get emitData(): import("../types").Dispatch<T>;
    get emitMessage(): import("../types").Dispatch<string>;
    get mutable(): Mutable<T>;
    get state(): State;
    get isInit(): boolean;
    get isDone(): boolean;
    get isError(): boolean;
    get isPending(): boolean;
    get data(): T;
    get message(): string;
    setState(state: State): void;
    setData(data: T | undefined): void;
    setMessage(message: string): void;
    reset(): void;
    get walletStatus(): WalletStatus;
    get isWalletConnected(): boolean;
    get isWalletDisconnected(): boolean;
    get isWalletRejected(): boolean;
    get isWalletNotExist(): boolean;
    get isWalletError(): boolean;
    abstract update(): void | Promise<void>;
}

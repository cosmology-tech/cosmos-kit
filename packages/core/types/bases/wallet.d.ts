import { AppEnv, Callbacks, SessionOptions, Wallet, WalletClient } from '../types';
import { StateBase } from './state';
export declare abstract class WalletBase<Data> extends StateBase<Data> {
    clientPromise?: WalletClient | Promise<WalletClient | undefined>;
    client?: WalletClient;
    protected _walletInfo: Wallet;
    protected _env?: AppEnv;
    protected _appUrl?: string;
    protected _qrUrl?: string;
    constructor(walletInfo: Wallet);
    get walletInfo(): Wallet;
    get walletName(): string;
    get walletPrettyName(): string;
    get appUrl(): string | undefined;
    get qrUrl(): string | undefined;
    get env(): AppEnv;
    setEnv(env?: AppEnv): void;
    disconnect(callbacks?: Callbacks): void;
    setClientNotExist(): void;
    setRejected(): void;
    setError(e: Error | string): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    abstract update(sessionOptions?: SessionOptions, callbacks?: Callbacks): void | Promise<void>;
}

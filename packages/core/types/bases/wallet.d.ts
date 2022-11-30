import { Callbacks, DownloadInfo, SessionOptions, Wallet, WalletClient } from '../types';
import { StateBase } from './state';
export declare abstract class WalletBase<Data> extends StateBase<Data> {
    clientPromise?: WalletClient | Promise<WalletClient | undefined>;
    client?: WalletClient;
    protected _walletInfo: Wallet;
    protected _appUrl?: string;
    protected _qrUrl?: string;
    callbacks?: Callbacks;
    constructor(walletInfo: Wallet);
    get walletInfo(): Wallet;
    get downloadInfo(): DownloadInfo | undefined;
    get walletName(): string;
    get walletPrettyName(): string;
    get rejectMessageSource(): string;
    get rejectMessageTarget(): string;
    get rejectCode(): number;
    rejectMatched(e: Error): boolean;
    get appUrl(): string | undefined;
    get qrUrl(): string | undefined;
    updateCallbacks(callbacks: Callbacks): void;
    disconnect: (callbacks?: Callbacks) => Promise<void>;
    setClientNotExist(): void;
    setRejected(): void;
    setError(e: Error | string): void;
    connect: (sessionOptions?: SessionOptions, callbacks?: Callbacks) => Promise<void>;
    abstract fetchClient(): WalletClient | undefined | Promise<WalletClient | undefined>;
    abstract update(sessionOptions?: SessionOptions, callbacks?: Callbacks): void | Promise<void>;
}

import { Callbacks, SessionOptions, Wallet } from '../types';
import { StateBase } from './state';
export declare abstract class WalletBase<Client, Data> extends StateBase<Data> {
    protected _client?: Client;
    constructor();
    get walletName(): string;
    get client(): Client;
    disconnect(callbacks?: Callbacks): void;
    setClientNotExist(): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    abstract get walletInfo(): Wallet;
    abstract fetchClient(): Client | Promise<Client>;
    abstract update(): void | Promise<void>;
}

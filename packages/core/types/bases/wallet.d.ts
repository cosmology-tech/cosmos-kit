import { Callbacks, SessionOptions, Wallet } from '../types';
import { StateBase } from './state';
export declare abstract class WalletBase<Client, Data> extends StateBase<Data> {
    constructor();
    get walletName(): string;
    disconnect(callbacks?: Callbacks): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    abstract get walletInfo(): Wallet;
    abstract get client(): Client | undefined;
}

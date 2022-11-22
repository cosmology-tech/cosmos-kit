import { ChainWalletBase } from './bases/chain-wallet';
import { StateBase } from './bases/state';
import { ChainName, Data, SessionOptions, WalletName } from './types';
export declare class WalletRepo extends StateBase<Data> {
    protected _wallets: ChainWalletBase[];
    options: {
        disconnectAllAtOnce: boolean;
        connectAllAtOnce: boolean;
        autoSelectWithSingleWallet: boolean;
    };
    constructor(wallets: ChainWalletBase[]);
    get wallets(): ChainWalletBase[];
    get isSingleWallet(): boolean;
    getWallet: (chainName: ChainName, walletName: WalletName) => ChainWalletBase | undefined;
    openView: () => void;
    connect(sessionOptions?: SessionOptions): Promise<void>;
    disconnect(): Promise<void>;
}

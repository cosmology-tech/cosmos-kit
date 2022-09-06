import { WalletCommonBase } from './wallet-common';
import { ChainName, ChainWalletData, Dispatch, State } from '../types';


export abstract class ChainWalletBase<T extends ChainWalletData, MainWallet> extends WalletCommonBase<T> {
    protected _chainName: ChainName;
    protected mainWallet?: MainWallet;

    constructor(_chainName: ChainName, mainWallet?: MainWallet) {
        super();
        this._chainName = _chainName;
        this.mainWallet = mainWallet;
    };

    get chainName() {
        return this._chainName;
    };

    get address(): string | undefined {
        return this.data?.address;
    }

    disconnect() {
        this.clear();
    }
};
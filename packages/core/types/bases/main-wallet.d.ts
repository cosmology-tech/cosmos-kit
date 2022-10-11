import { Callbacks, ChainName, ChainRecord, Wallet } from '../types';
import { MainWalletDataBase } from '../types';
import { WalletBase } from './wallet';
export declare abstract class MainWalletBase<Client, Data extends MainWalletDataBase, ChainWallet extends {
    disconnect: () => void;
}> extends WalletBase<Client, Data> {
    protected _chains: Map<ChainName, ChainWallet>;
    protected _walletInfo: Wallet;
    constructor(walletInfo: Wallet, chainRecords?: ChainRecord[]);
    get walletInfo(): Wallet;
    get username(): string | undefined;
    get chains(): Map<string, ChainWallet>;
    getChain(chainName: string): ChainWallet;
    disconnect(callbacks?: Callbacks): void;
    abstract setChains(supportedChains?: ChainRecord[]): void;
}

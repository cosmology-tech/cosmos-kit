import { ChainWalletBase } from '@cosmos-kit/core';
import { ChainName, State, Dispatch } from '@cosmos-kit/core';
import { WCWallet } from '.';
import { ChainWCData } from './types';


export class ChainWC extends ChainWalletBase<ChainWCData, WCWallet> {
    protected _chainName: ChainName;
    protected wcWallet: WCWallet;

    constructor(_chainName: ChainName, wcWallet: WCWallet) {
        super(_chainName, wcWallet);
        this._chainName = _chainName;
        this.wcWallet = wcWallet;
    };

    get client() {
        return this.wcWallet.client;
    }

    get username(): string | undefined {
        return this.data?.username;
    }

    async update(emitState?: Dispatch<State>, emitData?: Dispatch<ChainWCData | undefined>) {
        // this.setState(State.Pending, emitState);
        // try {
        //     const key = await this.client.connect(this.chainName);
        //     this.setData({
        //         address: key.bech32Address,
        //         username: key.name
        //     }, emitData);
        //     this.setState(State.Done, emitState);
        // } catch (e) {
        //     this.setState(State.Error, emitState);
        //     console.info(`Fail to update chain ${this.chainName}.`);
        //     throw e;
        // }
    }
};
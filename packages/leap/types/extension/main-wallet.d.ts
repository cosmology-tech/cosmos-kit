import { ChainInfo, ChainName, Wallet } from "@cosmos-kit/core";
import { MainWalletBase } from "@cosmos-kit/core";
import { ChainLeapExtension } from "./chain-wallet";
import { ChainLeapExtensionData, Leap, LeapExtensionData } from "./types";
export declare class LeapExtensionWallet extends MainWalletBase<Leap, LeapExtensionData, ChainLeapExtensionData, ChainLeapExtension> {
    protected _chains: Map<ChainName, ChainLeapExtension>;
    protected _client: Promise<Leap | undefined> | undefined;
    constructor(_walletInfo?: Wallet, _chainsInfo?: ChainInfo[]);
    setChains(chainsInfo: ChainInfo[]): void;
    update(): Promise<void>;
}

import { ChainInfo, ChainWalletBase } from "@cosmos-kit/core";
import { LeapExtensionWallet } from "./main-wallet";
import { ChainLeapExtensionData, Leap } from "./types";
export declare class ChainLeapExtension extends ChainWalletBase<Leap, ChainLeapExtensionData, LeapExtensionWallet> {
    constructor(_chainRecord: ChainInfo, mainWallet: LeapExtensionWallet);
    get client(): Leap | Promise<Leap>;
    get username(): string | undefined;
    update(): Promise<void>;
}

import { WalletStatus } from "../components";
import { State } from "@cosmos-kit/core";

export const getWalletStatusFromState = (state?: State): WalletStatus => {
    switch (state) {
        case State.Pending:
            return WalletStatus.Loading;
        case State.Done:
            return WalletStatus.Loaded;
        case State.Error:
            return WalletStatus.Rejected;
        case State.Init:
            return WalletStatus.Unloaded;
        default:
            return WalletStatus.Unloaded;
    }
}
import { State, WalletStatus } from "@cosmos-kit/core";

export const getWalletStatusFromState = (state?: State, message?: string): WalletStatus => {
    switch (state) {
        case State.Pending:
            return WalletStatus.Connecting;
        case State.Done:
            return WalletStatus.Connected;
        case State.Error:
            switch (message) {
                case "Client Not Exist!":              
                    return WalletStatus.NotExist;      
                default:
                    return WalletStatus.Rejected;
            }
        case State.Init:
            return WalletStatus.Disconnected;
        default:
            return WalletStatus.Disconnected;
    }
}
import { WalletManager } from "@cosmos-kit/core";
import { ModalHead } from "../components";
import { WalletInfoType } from "../types";

export const getModalHead = (
    walletManager: WalletManager,
    currentWalletData: WalletInfoType,
    handleClose: () => void
) => {

    function handleClearSelect() {
        walletManager.setCurrentWallet(undefined);
    }

    if (walletManager.currentWalletName) {
        return (
            <ModalHead
                title={currentWalletData.walletName}
                backButton={true}
                onClose={handleClose}
                onBack={handleClearSelect}
            />
        );
    } else {
        return (
            <ModalHead
                title="Select a Wallet"
                backButton={false}
                onClose={handleClose}
            />
        );
    }
}
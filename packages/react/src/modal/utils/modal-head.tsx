import React from 'react';
import { WalletManager } from "@cosmos-kit/core";
import { ModalHead } from "../components";
import { WalletInfoType } from "../types";

export const getModalHead = (
    walletManager: WalletManager,
    currentWalletData: WalletInfoType,
    handleClose: () => void,
    modalReset: boolean,
    setModalReset: (v: boolean) => void
) => {

    function onBack() {
        setModalReset(true);
    }

    if (walletManager.currentWalletName && !modalReset) {
        return (
            <ModalHead
                title={currentWalletData.walletName}
                backButton={true}
                onClose={handleClose}
                onBack={onBack}
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
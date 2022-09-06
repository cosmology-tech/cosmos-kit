import React, { useEffect, useState } from "react";
import { ChainName, WalletName } from "@cosmos-kit/core";
import { walletContext } from "./provider";

export const useWallet = (chainName?: ChainName) => {
    const wallet = React.useContext(walletContext);

    if (!wallet) {
        throw new Error("You have forgot to use WalletProvider");
    }

    const { walletManager, setOpenModal } = wallet;

    if (walletManager.currentChainName !== chainName) {
        walletManager.setCurrentChain(chainName);
    }

    const { currentWallet, currentChainWallet, connect, disconnect, useModal, autoConnect,
        currentWalletName, currentChainName } = walletManager;

    const [walletData, setWalletData] = useState<any>();
    const [chainWalletData, setChainWalletData] = useState<any>();
    const [walletState, setWalletState] = useState(currentWallet?.state);
    const [chainWalletState, setChainWalletState] = useState(currentChainWallet?.state);
    const [walletName, setWalletName] = useState<WalletName | undefined>(currentWalletName);
    // const [, setChainName] = useState<ChainName | undefined>(currentChainName);

    walletManager.updateAction({
        walletData: setWalletData,
        chainWalletData: setChainWalletData,
        walletState: setWalletState,
        walletName: setWalletName,
        chainWalletState: setChainWalletState,
        // chainName: setChainName,
        openModal: setOpenModal
    })

    useEffect(() => {
        if (autoConnect && !useModal) {
            connect();
        }
    }, [])

    return {
        connect: useModal && !currentWalletName ? () => setOpenModal(true) : connect,
        disconnect,
        state: chainName ? chainWalletState : walletState,
        username: walletData?.username,
        address: chainWalletData?.address
    };
}
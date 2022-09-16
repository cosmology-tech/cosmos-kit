import { WalletModalProps } from "@cosmos-kit/core";
import Bowser from "bowser";
import { ConnectModal } from "./components/ConnectModal";
import { UserDeviceInfoType, WalletInfoType } from "./types";
import { ReactNode, useEffect, useState } from "react";
import { useWallet } from "../hooks";
import { getModalHead } from "./utils/modal-head";
import { getModalContent } from "./utils/modal-content";

export const DefaultModal = ({ isOpen, setOpen }: WalletModalProps) => {

    const walletManager = useWallet();
    const [modalHead, setModalHead] = useState<ReactNode>();
    const [modalContent, setModalContent] = useState<ReactNode>();
    const [userBrowserInfo, setUserBrowserInfo] = useState<
        UserDeviceInfoType | undefined
    >();
    let [modalReset, setModalReset] = useState(false);

    const walletsData: WalletInfoType[] = walletManager.activeWallets.map(({
        name, logo, prettyName, isQRCode, downloads
    }) => ({
        id: name,
        logo,
        walletName: prettyName,
        walletType: isQRCode ? 'qrcode' : 'extension',
        extensionLink: { ...downloads, websiteDownload: downloads?.default },
        websiteDownload: downloads?.default,
        qrCodeLink: walletManager.currentWallet?.qrUri
    }))

    const currentWalletData = walletsData.find(data => data.id === walletManager.currentWalletName);

    function handleClose() {
        setOpen(false);
        if (walletManager.walletStatus === 'Connecting') {
            walletManager.disconnect();
        }
    }

    useEffect(() => {
        setUserBrowserInfo({
            browser: Bowser.getParser(window.navigator.userAgent).getBrowserName(
                true
            ),
            device: Bowser.getParser(window.navigator.userAgent).getPlatform().type,
            os: Bowser.getParser(window.navigator.userAgent).getOSName(true),
        });
    }, []);

    useEffect(() => {
        setModalHead(
            getModalHead(walletManager, currentWalletData, handleClose, modalReset, setModalReset)
        );
        setModalContent(
            getModalContent(walletManager, currentWalletData, userBrowserInfo, walletsData, modalReset, setModalReset)
        );
        if (!isOpen) {
            setModalReset(false);
        }
    }, [walletManager.walletStatus, walletManager.currentChainName, walletManager.currentWalletName,
    modalReset, isOpen, walletManager.currentWallet?.qrUri])

    return (
        <ConnectModal
            modalIsOpen={isOpen}
            modalOnClose={handleClose}
            walletsData={walletsData}
            modalHead={modalHead}
            modalContent={modalContent}
        />
    );
}
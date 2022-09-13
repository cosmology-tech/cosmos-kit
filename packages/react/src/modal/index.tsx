import { WalletModalProps, WalletStatus } from "@cosmos-kit/core";
import { IoExitOutline } from "react-icons/io5";
import { GoDesktopDownload } from "react-icons/go";
import Bowser from "bowser";
import {
    ConnectModal,
    ModalHead,
    DisplayWalletList,
    ExtensionContent,
    InstallWalletButton,
    QRCode,
    ConnectedContent,
} from "./ConnectModal";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { SimpleAvatarWithName } from "./ConnectWalletCard";
import { DefaultLink } from "./default-component";
import { SimpleCopyAddressButton } from "./SimpleCopyAddressButton";
import { Astronaut } from "./svg-icons";
import { UserDeviceInfoType, WalletInfoType } from "./types";
import { ReactNode, useEffect, useState } from "react";
import { useWallet } from "../hooks";

export const DefaultModal = ({ isOpen, setOpen, chainName }: WalletModalProps) => {

    const wm = useWallet(chainName);
    const [modalHead, setModalHead] = useState<ReactNode>();
    const [modalContent, setModalContent] = useState<ReactNode>();
    const [userBrowserInfo, setUserBrowserInfo] = useState<
        UserDeviceInfoType | undefined
    >();

    console.log(wm.currentWallet?.qrUri)

    const walletsData: WalletInfoType[] = wm.activeWallets.map(({
        name, logo, prettyName, isQRCode, downloads
    }) => ({
        id: name,
        logo,
        walletName: prettyName,
        walletType: isQRCode ? 'qrcode' : 'extension',
        extensionLink: { ...downloads, websiteDownload: downloads?.default },
        websiteDownload: downloads?.default,
    }))

    const currentWalletData = walletsData.find(data => data.id === wm.currentWalletName);

    const installedWallet = wm.walletStatus !== WalletStatus.NotExist;

    async function onWalletClicked(select: WalletInfoType) {
        console.info('Connecting ' + select.id)
        await wm.setCurrentWallet(select.id);
        if (!wm.autos?.connectWhenCurrentChanges) {
            await wm.connect();
        }
    }

    async function onDisconnect() {
        console.info('Disconnecting')
        await wm.disconnect();
    }

    function handleClearSelect() {
        wm.setCurrentWallet(undefined);
    }
    function handleClose() {
        setOpen(false);
        if (wm.walletStatus === 'Connecting') {
            wm.disconnect();
        }
    }
    async function handleConnectButtonClick() {
        console.log("reconnect wallet");
        await wm.connect();
    }

    useEffect(() => {
        setUserBrowserInfo({
            browser: Bowser.getParser(window.navigator.userAgent).getBrowserName(
                true
            ),
            device: Bowser.getParser(window.navigator.userAgent).getPlatform().type,
            os: Bowser.getParser(window.navigator.userAgent).getOSName(true),
        });
        if (!isOpen) {
            // setOpen(true);
            setModalHead(
                <ModalHead
                    title="Select a Wallet"
                    backButton={false}
                    onClose={handleClose}
                />
            );
            setModalContent(
                <DisplayWalletList
                    walletsData={walletsData}
                    onClick={onWalletClicked}
                />
            );
        }
    }, []);

    useEffect(() => {
        if (wm.currentWalletName) {
            setModalHead(
                <ModalHead
                    title={currentWalletData.walletName}
                    backButton={true}
                    onClose={handleClose}
                    onBack={handleClearSelect}
                />
            );
            if (currentWalletData.walletType === 'extension') {
                if (installedWallet) {
                    switch (wm.walletStatus) {
                        case WalletStatus.Disconnected:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Wallet Not Connected"
                                    stateDesc="Please connect to your wallet."
                                    isReconnect={true}
                                    isWarning={true}
                                    connectWalletButton={
                                        <ConnectWalletButton
                                            buttonText="Connect Wallet"
                                            onClickConnectBtn={handleConnectButtonClick}
                                        />
                                    }
                                />
                            );
                            break;
                        // case WalletStatus.NotExist:
                        //     setModalContent(
                        //         <ExtensionContent
                        //             selectedWallet={currentWalletData}
                        //             stateHeader="Wallet Not Exist"
                        //             stateDesc="Please check out your wallet."
                        //             isReconnect={true}
                        //             connectWalletButton={
                        //                 <ConnectWalletButton
                        //                     buttonText="Connect Wallet"
                        //                     onClickConnectBtn={handleConnectButtonClick}
                        //                 />
                        //             }
                        //         />
                        //     );
                        //     break;
                        case WalletStatus.Rejected:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Error"
                                    stateDesc={wm.message}
                                    isReconnect={true}
                                    connectWalletButton={
                                        <ConnectWalletButton
                                            buttonText="Reconnect"
                                            onClickConnectBtn={handleConnectButtonClick}
                                        />
                                    }
                                />
                            );
                            break;
                        case WalletStatus.Connecting:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Requesting Connection"
                                    stateDesc={`Open the ${currentWalletData.walletName} browser extension to connect your wallet.`}
                                    isLoading={true}
                                />
                            );
                            break;
                        case WalletStatus.Connected:
                            setModalContent(
                                <ConnectedContent
                                    userInfo={
                                        <SimpleAvatarWithName
                                            username={wm.username}
                                            icon={<Astronaut />}
                                            walletIcon={currentWalletData.logo}
                                        />
                                    }
                                    addressBtn={<SimpleCopyAddressButton address={wm.address} />}
                                    connectWalletButton={
                                        <ConnectWalletButton
                                            buttonText="Disconnect"
                                            icon={IoExitOutline}
                                            onClickConnectBtn={onDisconnect}
                                        />
                                    }
                                />
                            );
                            break;
                        default:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Oops! Something wrong..."
                                    stateDesc="Please reconnect your wallet."
                                    isReconnect={true}
                                    connectWalletButton={
                                        <ConnectWalletButton
                                            buttonText="Connect Wallet"
                                            onClickConnectBtn={handleConnectButtonClick}
                                        />
                                    }
                                />
                            );
                            break;
                    }
                }
                if (!installedWallet) {
                    setModalContent(
                        <ExtensionContent
                            selectedWallet={currentWalletData}
                            stateHeader={`Install ${currentWalletData.walletName}`}
                            stateDesc={`To connect your ${currentWalletData.walletName} wallet,
                    install the browser extension.`}
                            downloadWalletButton={
                                <DefaultLink
                                    target="_blank"
                                    href={
                                        currentWalletData.extensionLink[userBrowserInfo.device].find(
                                            ({ browser, os }) =>
                                                browser === userBrowserInfo.browser ||
                                                os === userBrowserInfo.os
                                        )?.link || currentWalletData.websiteDownload
                                    }
                                >
                                    <InstallWalletButton
                                        icon={
                                            currentWalletData.extensionLink[userBrowserInfo.device].find(
                                                ({ browser, os }) =>
                                                    browser === userBrowserInfo.browser ||
                                                    os === userBrowserInfo.os
                                            )?.icon || GoDesktopDownload
                                        }
                                        text={`Install ${currentWalletData.walletName} ${userBrowserInfo.device === "desktop" ? "Extension" : "App"
                                            }`}
                                    />
                                </DefaultLink>
                            }
                        />
                    );
                }
            }
            if (currentWalletData.walletType === "qrcode") {
                setModalContent(<QRCode link={wm.currentWallet.qrUri as string} />);
            }
        }
        if (!wm.currentWalletName) {
            setModalHead(
                <ModalHead
                    title="Select a Wallet"
                    backButton={false}
                    onClose={handleClose}
                />
            );
            setModalContent(
                <DisplayWalletList
                    walletsData={walletsData}
                    onClick={onWalletClicked}
                />
            );
        }
    }, [wm.currentWalletName, wm.walletStatus]);

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
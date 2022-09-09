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

export const DefaultModal = ({ isOpen, setOpen, chainName, qrUri }: WalletModalProps) => {

    const { walletManager, disconnect, walletStatus, username, address } = useWallet(chainName);
    // console.log('%cindex.tsx line:26 address', 'color: #007acc;', address);
    const { activeWallets, currentWalletName } = walletManager;
    // console.log('%cindex.tsx line:26 walletManager.address', 'color: #007acc;', walletManager.address);

    const walletsData: WalletInfoType[] = activeWallets.map(({
        name, logo, prettyName, isQRCode, downloads
    }) => ({
        id: name,
        logo,
        walletName: prettyName,
        walletType: isQRCode ? 'qrcode' : 'extension',
        extensionLink: {...downloads, websiteDownload: downloads?.default},
        websiteDownload: downloads?.default,
    }))

    const currentWalletData = walletsData.find(data => data.id === currentWalletName);

    const installedWallet = walletStatus !== WalletStatus.NotExist;

    const [modalHead, setModalHead] = useState<ReactNode>();
    const [modalContent, setModalContent] = useState<ReactNode>();
    const [userBrowserInfo, setUserBrowserInfo] = useState<
        UserDeviceInfoType | undefined
    >();

    async function handleWalletClick(select: WalletInfoType) {
        console.info('Connecting ' + select.id)
        walletManager.setCurrentWallet(select.id);
        await walletManager.connect();
    }
    function handleClearSelect() {
        walletManager.setCurrentWallet(undefined);
    }
    function handleClose() {
        setOpen(false);
    }
    async function handleConnectButtonClick() {
        console.log("reconnect wallet");
        await walletManager.connect();
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
                    onClick={handleWalletClick}
                />
            );
        }
    }, []);

    console.log('%cindex.tsx line:89 walletStatus', 'color: #007acc;', walletStatus);
    useEffect(() => {
        console.log('%cindex.tsx line:91 walletStatus', 'color: white; background-color: #007acc;', walletStatus);
        if (currentWalletName) {
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
                    switch (walletStatus) {
                        case WalletStatus.Init:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Wallet Not Init"
                                    stateDesc="Please check out your wallet."
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
                                    stateHeader="Request Cancelled"
                                    stateDesc={`You cancelled the request. 
                          Click above to try again.`}
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
                        case WalletStatus.Loading:
                            setModalContent(
                                <ExtensionContent
                                    selectedWallet={currentWalletData}
                                    stateHeader="Requesting Connection"
                                    stateDesc={`Open the ${currentWalletData.walletName} browser extension to connect your wallet.`}
                                    isLoading={true}
                                />
                            );
                            break;
                        case WalletStatus.Loaded:
                            setModalContent(
                                <ConnectedContent
                                    userInfo={
                                        <SimpleAvatarWithName
                                            username={username}
                                            icon={<Astronaut />}
                                            walletIcon={currentWalletData.logo}
                                        />
                                    }
                                    addressBtn={<SimpleCopyAddressButton address={address} />}
                                    connectWalletButton={
                                        <ConnectWalletButton
                                            buttonText="Disconnect"
                                            icon={IoExitOutline}
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
                setModalContent(<QRCode link={qrUri} />);
            }
        }
        if (!currentWalletName) {
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
                    onClick={handleWalletClick}
                />
            );
        }
    }, [installedWallet, walletStatus, currentWalletName]);

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
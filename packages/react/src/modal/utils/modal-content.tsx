import React from 'react';
import { WalletManager, WalletStatus } from "@cosmos-kit/core";
import { GoDesktopDownload } from "react-icons/go";
import { IoExitOutline } from "react-icons/io5";
import { Astronaut, ConnectedContent, ConnectWalletButton, DefaultLink, DisplayWalletList, ExtensionContent, InstallWalletButton, QRCode, SimpleAvatarWithName, SimpleCopyAddressButton } from "../components";
import { ExtensionLinkType, UserDeviceInfoType, WalletRecordType } from "../types";

export const getModalContent = (
    walletManager: WalletManager,
    currentWalletData: WalletRecordType | undefined,
    userBrowserInfo: UserDeviceInfoType | undefined,
    walletsData: WalletRecordType[],
    modalReset: boolean,
    setModalReset: (v: boolean) => void
) => {
    async function onWalletClicked(select: WalletRecordType) {
        setModalReset(false);
        console.info('Connecting to ' + select.id);
        walletManager.setCurrentWallet(select.id);
        await walletManager.connect();
    }

    async function onDisconnect() {
        console.info('Disconnecting')
        await walletManager.disconnect();
    }

    async function handleConnectButtonClick() {
        console.log("reconnect wallet");
        await walletManager.connect();
    }

    function onChangeWallet() {
        setModalReset(true);
    }

    if (currentWalletData && !modalReset) {
        switch (walletManager.walletStatus) {
            case WalletStatus.Disconnected:
                if (currentWalletData.walletType === 'extension') {
                    return (
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
                }
                else if (currentWalletData.walletType === "qrcode") {
                    if (walletManager.currentWallet!.isInSession) {
                        return (
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
                    } else {
                        return (<QRCode link={currentWalletData.qrCodeLink!} />);
                    }
                }
            case WalletStatus.NotExist:
                let link, icon;
                if (userBrowserInfo?.device) {
                    link = currentWalletData.extensionLink
                        ?.[userBrowserInfo.device as keyof ExtensionLinkType]
                        ?.find(
                            ({ browser, os }) =>
                                browser === userBrowserInfo.browser ||
                                os === userBrowserInfo.os
                        )?.link || currentWalletData.websiteDownload;
                    icon = currentWalletData.extensionLink
                        ?.[userBrowserInfo.device as keyof ExtensionLinkType]
                        ?.find(
                            ({ browser, os }) =>
                                browser === userBrowserInfo.browser ||
                                os === userBrowserInfo.os
                        )?.icon || GoDesktopDownload;
                } else {
                    link = currentWalletData.websiteDownload;
                    icon = GoDesktopDownload;
                }
                return (
                    <ExtensionContent
                        selectedWallet={currentWalletData}
                        stateHeader={`Install ${currentWalletData.walletName}`}
                        stateDesc={`To connect your ${currentWalletData.walletName} wallet,
            install the browser extension.`}
                        downloadWalletButton={
                            <DefaultLink
                                target="_blank"
                                href={link}
                            >
                                <InstallWalletButton
                                    icon={icon}
                                    text={`Install ${currentWalletData.walletName}`}
                                />
                            </DefaultLink>
                        }
                    />
                );
            case WalletStatus.Rejected:
                return (
                    <ExtensionContent
                        selectedWallet={currentWalletData}
                        stateHeader="Error"
                        stateDesc={walletManager.message}
                        isReconnect={true}
                        connectWalletButton={
                            <ConnectWalletButton
                                buttonText="Reconnect"
                                onClickConnectBtn={handleConnectButtonClick}
                            />
                        }
                    />
                );
            case WalletStatus.Error:
                return (
                    <ExtensionContent
                        selectedWallet={currentWalletData}
                        stateHeader="Error"
                        stateDesc={walletManager.message}
                        isReconnect={true}
                        connectWalletButton={
                            <ConnectWalletButton
                                isDisabled={false}
                                buttonText="Change Wallet"
                                onClickConnectBtn={onChangeWallet}
                            />
                        }
                    />
                );
            case WalletStatus.Connecting:
                let stateDesc: string = '';
                if (currentWalletData.walletType === 'extension') {
                    stateDesc = `Open the ${currentWalletData.walletName} browser extension to connect your wallet.`
                } else if (currentWalletData.walletType === "qrcode") {
                    stateDesc = `Approve ${currentWalletData.walletName} connection request on your mobile.`
                }
                return (
                    <ExtensionContent
                        selectedWallet={currentWalletData}
                        stateHeader="Requesting Connection"
                        stateDesc={stateDesc}
                        isLoading={true}
                    />
                );
            case WalletStatus.Connected:
                return (
                    <ConnectedContent
                        userInfo={
                            <SimpleAvatarWithName
                                username={walletManager.username}
                                icon={<Astronaut />}
                                walletIcon={currentWalletData.logo}
                            />
                        }
                        addressBtn={<SimpleCopyAddressButton address={walletManager.address} />}
                        connectWalletButton={
                            <ConnectWalletButton
                                buttonText="Disconnect"
                                icon={IoExitOutline}
                                onClickConnectBtn={onDisconnect}
                            />
                        }
                    />
                );
            default:
                return (
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
        }
    } else {
        return (
            <DisplayWalletList
                walletsData={walletsData}
                onClick={onWalletClicked}
            />
        );
    }
}
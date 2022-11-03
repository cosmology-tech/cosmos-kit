/* eslint-disable no-console */
import { Box, Icon } from '@chakra-ui/react';
import { WalletManager, WalletStatus } from '@cosmos-kit/core';
import React from 'react';
import { GoDesktopDownload } from 'react-icons/go';
import { RiDoorOpenFill } from 'react-icons/ri';

import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  LogoStatus,
  SimpleDisplayModalContent as ModalContent,
  SimpleDisplayWalletList as DisplayWalletList,
  SimpleInstallWalletButton as InstallWalletButton,
  SimpleModalHead as ModalHead,
  SimpleQRCode as QRCode,
} from '../components';
import { UserDeviceInfoType, WalletInfoType } from '../components/types';

export const getModal = (
  browser: UserDeviceInfoType | undefined,
  walletManager: WalletManager,
  modalIsReset: boolean,
  resetModal: (v: boolean) => void,
  handleClose: () => void
) => {
  const wallets: WalletInfoType[] = walletManager.wallets.map(
    ({ walletInfo: { name, logo, prettyName } }) => ({
      id: name,
      logo,
      displayName: prettyName,
    })
  );

  const current = wallets.find(
    (data) => data.id === walletManager.currentWalletName
  );

  let modalHead: JSX.Element, modalContent: JSX.Element;

  /* ================================== */
  /*             modal head             */
  /* ================================== */

  function handleBack() {
    resetModal(true);
  }

  if (current && !modalIsReset) {
    modalHead = (
      <ModalHead
        title={current.displayName || current.id}
        backButton={true}
        onClose={handleClose}
        onBack={handleBack}
      />
    );
  } else {
    modalHead = (
      <ModalHead
        title="Select a Wallet"
        backButton={false}
        onClose={handleClose}
      />
    );
  }

  /* ================================== */
  /*             modal content          */
  /* ================================== */

  async function handleWalletClick(select: WalletInfoType) {
    resetModal(false);
    console.info('Connecting to ' + select.id);
    walletManager.setCurrentWallet(select.id);
    await walletManager.connect();
  }

  async function handleDisconnect() {
    console.info('Disconnecting');
    await walletManager.disconnect();
  }

  async function handleReconnect() {
    console.log('Reconnect wallet');
    await walletManager.connect();
  }

  function handleChangeWallet() {
    resetModal(true);
  }

  const appType = walletManager.env?.isMobile ? 'App' : 'Extension';
  const downloadInfo = walletManager.currentWalletInfo.downloads[
    browser.device
  ]?.find((info) => info.browser === browser.browser || info.os === browser.os);

  const modalInfo = {
    NotExist: {
      logoStatus: LogoStatus.Error,
      header: 'Wallet Not Exist',
      desc: `${current.displayName} ${appType} not installed on your device.`,
      buttonText: `Install ${appType}`,
      onClick: () => {
        const link =
          downloadInfo?.link ||
          walletManager.currentWalletInfo.downloads.default;
        if (link) {
          window.open(link, '_blank');
        } else {
          throw new Error(`${appType} download link not provided.`);
        }
      },
      icon: downloadInfo?.icon || GoDesktopDownload,
    },
    Connected: {
      buttonText: 'Disconnect',
      onClick: handleDisconnect,
      icon: <Icon as={RiDoorOpenFill} />,
    },
    Connecting: {
      logoStatus: LogoStatus.Loading,
      header: 'Requesting Connection',
      desc: current.qrCodeLink
        ? `Approve ${current.displayName} connection request on your mobile.`
        : `Open the ${current.displayName} extension to connect your wallet.`,
    },
    Rejected: {
      logoStatus: LogoStatus.Error,
      header: 'Request Rejected',
      desc: 'Connection authorization is denied.',
      buttonText: 'Reconnect',
      onClick: handleReconnect,
    },
    Error: {
      logoStatus: LogoStatus.Error,
      header: 'Oops! Something wrong...',
      desc: walletManager.message,
      buttonText: 'Change Wallet',
      onClick: handleChangeWallet,
    },
  };

  function getBottomButtonByStatus(walletStatus: WalletStatus) {
    const info = modalInfo[walletStatus];
    switch (walletStatus) {
      case WalletStatus.Connecting:
        return void 0;
      case WalletStatus.NotExist:
        return (
          <InstallWalletButton
            icon={info.icon}
            text={info.buttonText}
            onClick={info.onClick}
          />
        );
      default:
        return (
          <Box px={6}>
            <ConnectWalletButton
              size="lg"
              variant="primary"
              leftIcon={info.icon}
              buttonText={info.buttonText}
              onClickConnectBtn={info.onClick}
            />
          </Box>
        );
    }
  }

  function getModalContentByStatus(walletStatus: WalletStatus) {
    if (walletStatus === WalletStatus.Connected) {
      return (
        <ModalContent
          logo={Astronaut}
          username={walletManager.username}
          walletIcon={typeof current.logo === 'string' && current.logo}
          addressButton={
            <CopyAddressButton
              size="sm"
              isRound={true}
              address={walletManager.address}
            />
          }
          bottomButton={getBottomButtonByStatus(walletStatus)}
        />
      );
    }
    if (
      walletStatus === WalletStatus.Disconnected &&
      current.qrCodeLink &&
      !walletManager.env?.isMobile
    ) {
      return (
        <QRCode
          link={current.qrCodeLink}
          description={`Open ${current.displayName} App to Scan this QRCode`}
        />
      );
    }
    return (
      <ModalContent
        status={modalInfo[walletStatus].logoStatus}
        logo={current.logo}
        contentHeader={modalInfo[walletStatus].header}
        contentDesc={modalInfo[walletStatus].desc}
        bottomButton={getBottomButtonByStatus(walletStatus)}
      />
    );
  }

  if (current && !modalIsReset) {
    modalContent = getModalContentByStatus(walletManager.walletStatus);
  } else {
    modalContent = (
      <DisplayWalletList
        walletsData={wallets}
        handleClick={handleWalletClick}
      />
    );
  }

  return [modalHead, modalContent];
};

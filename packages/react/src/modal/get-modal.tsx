/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Box, Icon } from '@chakra-ui/react';
import { DownloadInfo, WalletManager, WalletStatus } from '@cosmos-kit/core';
import React, { RefObject } from 'react';
import { IconType } from 'react-icons';
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
} from './components';
import { UserDeviceInfoType, WalletInfoType } from './components/types';

interface ModalInfo {
  [k: string]: {
    logoStatus?: LogoStatus;
    header?: string;
    desc?: string;
    buttonText?: string;
    onClick?: () => void;
    icon?: IconType | JSX.Element;
  };
}

export const getModal = (
  userAgent: UserDeviceInfoType | undefined,
  walletManager: WalletManager,
  modalIsReset: boolean,
  resetModal: (v: boolean) => void,
  handleClose: () => void,
  initialFocus: RefObject<any>
) => {
  const {
    wallets,
    currentWallet: wallet,
    currentWalletInfo: walletInfo,
    walletStatus,
    address,
    username,
    message,
    env,
    setCurrentWallet,
    connect,
    disconnect,
  } = walletManager;

  let modalHead: JSX.Element, modalContent: JSX.Element;

  /* ================================== */
  /*           choose wallet            */
  /* ================================== */

  async function handleWalletClick(select: WalletInfoType) {
    resetModal(false);
    console.info('Connecting to ' + select.id);
    setCurrentWallet(select.id);
    await connect();
  }

  if (!wallet || modalIsReset) {
    modalHead = (
      <ModalHead
        title="Select Wallet"
        backButton={false}
        handleClose={handleClose}
      />
    );

    modalContent = (
      <DisplayWalletList
        initialFocus={initialFocus}
        walletsData={wallets.map(
          ({ walletInfo: { name, logo, prettyName } }) => ({
            id: name,
            logo,
            displayName: prettyName,
          })
        )}
        handleClick={handleWalletClick}
      />
    );

    return [modalHead, modalContent];
  }

  /* ================================== */
  /*    selected wallet: modal head     */
  /* ================================== */

  function handleBack() {
    resetModal(true);
  }

  modalHead = (
    <ModalHead
      title={walletInfo.prettyName || walletInfo.name}
      backButton={true}
      handleClose={handleClose}
      handleBack={handleBack}
    />
  );

  /* ================================== */
  /*   selected wallet: modal content   */
  /* ================================== */

  const appType = env?.isMobile ? 'App' : 'Extension';
  const downloadInfo: DownloadInfo | undefined = walletInfo.downloads?.[
    userAgent?.device
  ]?.find(
    (info) => info.browser === userAgent?.browser || info.os === userAgent?.os
  );
  const link = downloadInfo?.link || walletInfo.downloads?.default;

  async function handleDisconnect() {
    console.info('Disconnecting');
    await disconnect();
  }

  async function handleConnect() {
    console.log('Connecting');
    await connect();
  }

  function handleChangeWallet() {
    resetModal(true);
  }

  const modalInfo: ModalInfo = {
    NotExist: {
      logoStatus: LogoStatus.Error,
      header: `${appType} Not Installed`,
      buttonText: `Install ${appType}`,
      desc: link
        ? void 0
        : `Install link not provided. Try searching it or consulting the developer team.`,
      onClick: () => {
        window.open(link, '_blank');
      },
      icon: downloadInfo?.icon || GoDesktopDownload,
    },
    Disconnected: {
      logoStatus: LogoStatus.Warning,
      header: 'Wallet is Disconnected',
      buttonText: 'Connect Wallet',
      onClick: handleConnect,
    },
    Connected: {
      buttonText: 'Disconnect',
      onClick: handleDisconnect,
      icon: <Icon as={RiDoorOpenFill} />,
    },
    Connecting: {
      logoStatus: LogoStatus.Loading,
      header: 'Requesting Connection',
      desc: wallet?.qrUri
        ? `Approve ${walletInfo.prettyName} connection request on your mobile.`
        : `Open the ${walletInfo.prettyName} extension to connect your wallet.`,
    },
    Rejected: {
      logoStatus: LogoStatus.Error,
      header: 'Request Rejected',
      desc:
        walletInfo.rejectMessage?.target || 'Connection permission is denied.',
      buttonText: 'Reconnect',
      onClick: handleConnect,
    },
    Error: {
      logoStatus: LogoStatus.Error,
      header: 'Oops! Something wrong...',
      desc: message,
      buttonText: 'Change Wallet',
      onClick: handleChangeWallet,
    },
  };

  function getBottomButtonByStatus(status: WalletStatus) {
    const info = modalInfo[status];
    switch (status) {
      case WalletStatus.Connecting:
        return void 0;
      case WalletStatus.NotExist:
        return (
          <InstallWalletButton
            icon={info.icon as IconType}
            text={info.buttonText}
            onClick={info.onClick}
            disabled={link ? false : true}
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

  function getModalContentByStatus(status: WalletStatus) {
    if (status === WalletStatus.Connected) {
      return (
        <ModalContent
          logo={Astronaut}
          username={username}
          walletIcon={typeof walletInfo.logo === 'string' && walletInfo.logo}
          addressButton={
            <CopyAddressButton size="sm" isRound={true} address={address} />
          }
          bottomButton={getBottomButtonByStatus(status)}
        />
      );
    }
    if (status === WalletStatus.Disconnected && wallet?.qrUri) {
      if (!env?.isMobile || (env?.isMobile && !wallet.appUrl)) {
        return (
          <QRCode
            link={wallet?.qrUri}
            description={`Open ${walletInfo.prettyName} App to Scan`}
          />
        );
      }
    }

    const info = modalInfo[status];

    return (
      <ModalContent
        status={info.logoStatus}
        logo={walletInfo.logo}
        contentHeader={info.header}
        contentDesc={info.desc}
        bottomButton={getBottomButtonByStatus(status)}
      />
    );
  }

  modalContent = getModalContentByStatus(walletStatus);

  return [modalHead, modalContent];
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { WalletManager, WalletStatus } from '@cosmos-kit/core';
import React, { ReactNode, RefObject } from 'react';
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
import { WalletInfoType } from './components/types';

type ModalInfo = {
  [k in WalletStatus]: {
    logoStatus?: LogoStatus;
    header?: string;
    desc?: string;
    buttonText?: string;
    onClick?: () => void;
    icon?: IconType | JSX.Element;
    bottomLink?: ReactNode;
  };
};

export const getModal = (
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
    isMobile,
    setCurrentWallet,
    connect,
    disconnect,
    isWalletDisconnected,
  } = walletManager;

  let modalHead: JSX.Element, modalContent: JSX.Element;

  /* ================================== */
  /*           choose wallet            */
  /* ================================== */

  async function handleWalletClick(select: WalletInfoType) {
    resetModal(false);
    console.info('Connecting to ' + select.id);
    if (!isWalletDisconnected) {
      await disconnect();
    }
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
  /*           selected wallet          */
  /* ================================== */

  if (!walletInfo) {
    throw new Error('No basic wallet information!');
  }

  const displayName = walletInfo.prettyName || walletInfo.name;

  /* ================================== */
  /*    selected wallet: modal head     */
  /* ================================== */

  function handleBack() {
    resetModal(true);
  }

  modalHead = (
    <ModalHead
      title={displayName}
      backButton={true}
      handleClose={handleClose}
      handleBack={handleBack}
    />
  );

  /* ================================== */
  /*   selected wallet: modal content   */
  /* ================================== */

  const { downloadInfo } = wallet;

  const appType = isMobile ? 'App' : 'Extension';

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

  function handleOpenApp() {
    if (wallet!.appUrl) {
      window.location.href = wallet!.appUrl;
    }
  }

  function handleOpenDownload() {
    if (downloadInfo) {
      window.open(downloadInfo?.link, '_blank');
    }
  }

  const modalInfo: ModalInfo = {
    NotExist: {
      logoStatus: LogoStatus.Error,
      header: `${appType} Not Installed`,
      buttonText: `Install ${appType}`,
      desc: downloadInfo?.link
        ? `If wallet ${appType.toLowerCase()} is installed on your device, please refresh this page or follow the browser instructions.`
        : `Install link not provided. Try searching it or consulting the developer team.`,
      onClick: handleOpenDownload,
      icon: downloadInfo?.icon || GoDesktopDownload,
    },
    Disconnected: {
      logoStatus: LogoStatus.Warning,
      header: isMobile ? 'Wallet Authorization' : 'Wallet is Disconnected',
      desc: isMobile ? 'Approve connection in wallet app' : void 0,
      buttonText: isMobile ? 'Open App' : 'Connect Wallet',
      onClick: isMobile ? handleOpenApp : handleConnect,
      bottomLink:
        isMobile && downloadInfo ? (
          <Button variant="link" onClick={handleOpenDownload}>
            <Text as="u" fontSize="sm">
              don't have a wallet?
            </Text>
          </Button>
        ) : (
          void 0
        ),
    },
    Connected: {
      buttonText: 'Disconnect',
      onClick: handleDisconnect,
      icon: <Icon as={RiDoorOpenFill} />,
    },
    Connecting: {
      logoStatus: LogoStatus.Loading,
      header: 'Requesting Connection',
      desc: wallet.qrUrl
        ? `Approve ${displayName} connection request on your mobile.`
        : `Open the ${displayName} extension to connect your wallet.`,
    },
    Rejected: {
      logoStatus: LogoStatus.Error,
      header: 'Request Rejected',
      desc: wallet.rejectMessageTarget || 'Connection permission is denied.',
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
            disabled={downloadInfo?.link ? false : true}
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
    if (!walletInfo) {
      throw new Error('No basic wallet information!');
    }

    if (status === WalletStatus.Connected) {
      return (
        <ModalContent
          logo={Astronaut}
          username={username}
          walletIcon={
            (typeof walletInfo.logo === 'string' && walletInfo.logo) || void 0
          }
          addressButton={
            <CopyAddressButton size="sm" isRound={true} address={address} />
          }
          bottomButton={getBottomButtonByStatus(status)}
        />
      );
    }

    if (
      status === WalletStatus.Disconnected &&
      walletInfo.mode === 'wallet-connect' &&
      (!isMobile || (isMobile && !wallet!.appUrl))
    ) {
      return (
        <QRCode
          link={wallet!.qrUrl!}
          description={`Open ${displayName} App to Scan`}
        />
      );
    }

    const info = modalInfo[status];

    return (
      <ModalContent
        status={info.logoStatus}
        logo={walletInfo.logo}
        contentHeader={info.header}
        contentDesc={info.desc}
        bottomButton={getBottomButtonByStatus(status)}
        bottomLink={info.bottomLink}
      />
    );
  }

  modalContent = getModalContentByStatus(walletStatus);

  return [modalHead, modalContent];
};

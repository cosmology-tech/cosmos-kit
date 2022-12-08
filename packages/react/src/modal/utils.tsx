/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { ModalVersion, WalletManager, WalletStatus } from '@cosmos-kit/core';
import React, { ReactNode, RefObject } from 'react';
import { IconType } from 'react-icons';
import { GoDesktopDownload } from 'react-icons/go';
import { RiDoorOpenFill } from 'react-icons/ri';

import {
  Astronaut,
  ConnectWalletButton,
  CopyAddressButton,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleDisplayModalContentV1,
  SimpleDisplayWalletList,
  SimpleDisplayWalletListV1,
  SimpleInstallWalletButton,
  SimpleInstallWalletButtonV1,
  SimpleModalHead,
  SimpleModalHeadV1,
  SimpleQRCode,
  SimpleQRCodeV1,
} from './components';

type ModalInfo = {
  [k in WalletStatus]: {
    logoStatus?: LogoStatus;
    header?: string;
    desc?: string;
    buttonText?: string;
    onClick?: () => void;
    buttonDisabled?: boolean;
    icon?: IconType | JSX.Element;
    bottomLink?: ReactNode;
  };
};

export const getModalDetails = (
  walletManager: WalletManager,
  modalIsReset: boolean,
  resetModal: (v: boolean) => void,
  handleClose: () => void,
  initialFocus: RefObject<any>,
  version: ModalVersion
) => {
  let ModalContent: any,
    DisplayWalletList: any,
    InstallWalletButton: any,
    QRCode: any,
    ModalHead: any;
  switch (version) {
    case 'simple_v1':
      ModalContent = SimpleDisplayModalContentV1;
      DisplayWalletList = SimpleDisplayWalletListV1;
      InstallWalletButton = SimpleInstallWalletButtonV1;
      QRCode = SimpleQRCodeV1;
      ModalHead = SimpleModalHeadV1;
      break;
    case 'simple_v2':
      ModalContent = SimpleDisplayModalContent;
      DisplayWalletList = SimpleDisplayWalletList;
      InstallWalletButton = SimpleInstallWalletButton;
      QRCode = SimpleQRCode;
      ModalHead = SimpleModalHead;
      break;
  }
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

  if (!wallet || modalIsReset) {
    modalHead = (
      <ModalHead
        title="Select your wallet"
        backButton={false}
        handleClose={handleClose}
      />
    );

    const walletData = wallets.map(
      ({ walletInfo: { name, logo, prettyName, mode, mobileDisabled } }) => ({
        name,
        logo,
        prettyName,
        mode,
        mobileDisabled,
        onClick: async () => {
          resetModal(false);
          if (!isWalletDisconnected) {
            await disconnect();
          }
          setCurrentWallet(name);
          await connect();
        },
      })
    );

    modalContent = (
      <DisplayWalletList
        initialFocus={initialFocus}
        walletsData={
          version === 'simple_v2'
            ? walletData.sort((a, b) => {
                if (a.mode === b.mode) {
                  return 0;
                } else if (a.mode !== 'wallet-connect') {
                  return -1;
                } else {
                  return 1;
                }
              })
            : walletData
        }
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

  const { downloadInfo, walletName } = wallet;

  async function handleDisconnect() {
    await disconnect();
  }

  async function handleConnect() {
    setCurrentWallet(walletName);
    await connect();
  }

  function handleChangeWallet() {
    resetModal(true);
  }

  function handleOpenDownload() {
    if (downloadInfo?.link) {
      window.open(downloadInfo?.link, '_blank');
    }
  }

  const modalInfo: ModalInfo = {
    NotExist: {
      logoStatus: LogoStatus.Error,
      header: `${displayName} Not Installed`,
      buttonText: `Install ${displayName}`,
      desc: downloadInfo?.link
        ? `If ${displayName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instructions.`
        : `Download link not provided. Try searching it or consulting the developer team.`,
      onClick: handleOpenDownload,
      buttonDisabled: downloadInfo?.link ? false : true,
      icon: downloadInfo?.icon || GoDesktopDownload,
    },
    Disconnected: {
      logoStatus: LogoStatus.Warning,
      header: isMobile ? 'Wallet Authorization' : 'Wallet is Disconnected',
      desc: isMobile ? 'Approve connection in wallet app' : void 0,
      buttonText: isMobile ? 'Open App' : 'Connect Wallet',
      onClick: handleConnect,
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
        : `Open ${displayName} to connect your wallet.`,
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
      case 'Connecting':
        return void 0;
      case 'NotExist':
        return (
          <InstallWalletButton
            icon={info.icon as IconType}
            text={info.buttonText}
            onClick={info.onClick}
            disabled={info.buttonDisabled}
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

    if (status === 'Connected') {
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
      status === 'Disconnected' &&
      walletInfo.mode === 'wallet-connect' &&
      !wallet!.appUrl
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

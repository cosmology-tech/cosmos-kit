/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { ChainWalletBase, ModalVersion, WalletStatus } from '@cosmos-kit/core';
import { IconType } from 'react-icons';
import { GoDesktopDownload } from 'react-icons/go';
import { RiDoorOpenFill } from 'react-icons/ri';

import {
  Astronaut,
  ConnectModalContentType,
  ConnectWalletButton,
  CopyAddressButton,
  DownloadWalletButtonType,
  LogoStatus,
  SimpleDisplayModalContent,
  SimpleDisplayModalContentV1,
  SimpleInstallWalletButton,
  SimpleInstallWalletButtonV1,
  SimpleModalHead,
  SimpleModalHeadType,
  SimpleModalHeadV1,
  SimpleQRCode,
  SimpleQRCodeV1,
} from '../components';
import { DisplayType, ModalInfo } from '../types';

export const getSingleWalletView = (
  version: ModalVersion,
  wallet: ChainWalletBase | undefined,
  setOpen: (isOpen: boolean) => void,
  setDisplay: (display: DisplayType | undefined) => void
) => {
  if (!wallet) {
    return [void 0, void 0];
  }

  let ModalContent: (props: ConnectModalContentType) => JSX.Element,
    InstallWalletButton: (props: DownloadWalletButtonType) => JSX.Element,
    QRCode: (props: { link: string; description?: string }) => JSX.Element,
    ModalHead: (props: SimpleModalHeadType) => JSX.Element;
  switch (version) {
    case 'simple_v1':
      ModalContent = SimpleDisplayModalContentV1;
      InstallWalletButton = SimpleInstallWalletButtonV1;
      QRCode = SimpleQRCodeV1;
      ModalHead = SimpleModalHeadV1;
      break;
    case 'simple_v2':
      ModalContent = SimpleDisplayModalContent;
      InstallWalletButton = SimpleInstallWalletButton;
      QRCode = SimpleQRCode;
      ModalHead = SimpleModalHead;
      break;
  }

  const {
    walletInfo: { prettyName, name, logo, mode },
    walletStatus: status,
    isWalletConnected,
    isConnectingWalletConnect,
    downloadInfo,
    isMobile,
    connect,
    disconnect,
    qrUrl,
    appUrl,
    rejectMessageTarget,
    message,
    username,
    address,
  } = wallet;

  const displayName = prettyName || name;

  const modalInfo: ModalInfo = {
    NotExist: {
      logoStatus: LogoStatus.Error,
      header: `${displayName} Not Installed`,
      buttonText: `Install ${displayName}`,
      desc: downloadInfo?.link
        ? `If ${displayName.toLowerCase()} is installed on your device, please refresh this page or follow the browser instructions.`
        : `Download link not provided. Try searching it or consulting the developer team.`,
      onClick: () => {
        window.open(downloadInfo?.link, '_blank');
      },
      buttonDisabled: downloadInfo?.link ? false : true,
      icon: downloadInfo?.icon || GoDesktopDownload,
    },
    Disconnected: {
      logoStatus: LogoStatus.Warning,
      header: isMobile ? 'Wallet Authorization' : 'Wallet is Disconnected',
      desc: isMobile ? 'Approve connection in wallet app' : void 0,
      buttonText: isMobile ? 'Open App' : 'Connect Wallet',
      onClick: () => connect(),
      bottomLink:
        isMobile && downloadInfo ? (
          <Button
            variant="link"
            onClick={() => {
              window.open(downloadInfo?.link, '_blank');
            }}
          >
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
      onClick: async () => {
        await disconnect();
      },
      icon: <Icon as={RiDoorOpenFill} />,
    },
    Connecting: {
      logoStatus: LogoStatus.Loading,
      header: 'Requesting Connection',
      desc: qrUrl
        ? `Approve ${displayName} connection request on your mobile.`
        : isMobile
        ? `Open ${displayName} to connect your wallet.`
        : `If there isn't a modal popping up, check your network or extension status.`,
    },
    Rejected: {
      logoStatus: LogoStatus.Error,
      header: 'Request Rejected',
      desc: rejectMessageTarget || 'Connection permission is denied.',
      buttonText: 'Reconnect',
      onClick: () => connect(),
    },
    Error: {
      logoStatus: LogoStatus.Error,
      header: 'Oops! Something wrong...',
      desc: message,
      buttonText: 'Change Wallet',
      onClick: () => setDisplay('list'),
    },
  };

  function getBottomButton() {
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

  function getModalContent() {
    if (isWalletConnected) {
      return (
        <ModalContent
          logo={Astronaut}
          username={username}
          walletIcon={(typeof logo === 'string' && logo) || void 0}
          addressButton={
            <CopyAddressButton size="sm" isRound={true} address={address} />
          }
          bottomButton={getBottomButton()}
        />
      );
    }

    console.log(
      '%csingle-wallet.tsx line:187 isConnectingWalletConnect',
      'color: #007acc;',
      isConnectingWalletConnect
    );

    if (isConnectingWalletConnect && !appUrl) {
      return (
        <QRCode link={qrUrl} description={`Open ${displayName} App to Scan`} />
      );
    }

    const info = modalInfo[status];

    return (
      <ModalContent
        status={info.logoStatus}
        logo={logo}
        contentHeader={info.header}
        contentDesc={info.desc}
        bottomButton={getBottomButton()}
        bottomLink={info.bottomLink}
      />
    );
  }

  return [
    <ModalHead
      title={displayName}
      backButton={true}
      handleClose={() => setOpen(false)}
      handleBack={() => setDisplay('list')}
    />,
    getModalContent(),
  ];
};

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Icon, Text } from '@chakra-ui/react';
import { ChainWalletBase, ModalVersion } from '@cosmos-kit/core';
import React from 'react';
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
  current: ChainWalletBase | undefined,
  qrCodeWallet: ChainWalletBase | undefined,
  setOpen: (isOpen: boolean) => void,
  setDisplay: (display: DisplayType) => void,
  setQRCodeWallet: (wallet: ChainWalletBase | undefined) => void
) => {
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

  if (qrCodeWallet && qrCodeWallet.walletStatus === 'Disconnected') {
    const displayName =
      qrCodeWallet.walletInfo.prettyName || qrCodeWallet.walletName;
    return [
      <ModalHead
        title={displayName}
        backButton={true}
        handleClose={() => {
          setOpen(false);
          setQRCodeWallet(void 0);
          setDisplay('list');
        }}
        handleBack={() => setDisplay('list')}
      />,
      <QRCode
        link={qrCodeWallet.qrUrl!}
        description={`Open ${displayName} App to Scan`}
      />,
    ];
  }

  if (!current) {
    return [void 0, void 0];
  }

  const {
    walletInfo: { prettyName, name, logo },
    walletStatus: status,
    downloadInfo,
    isMobile,
    connect,
    disconnect,
    qrUrl,
    rejectMessageTarget,
    message,
    username,
    address,
  } = current!;

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
        setDisplay('list');
      },
      icon: <Icon as={RiDoorOpenFill} />,
    },
    Connecting: {
      logoStatus: LogoStatus.Loading,
      header: `Connecting ${current?.chain.pretty_name}`,
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
            disabled={info.buttonDisabled || false}
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
    if (status === 'Connected') {
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
      handleClose={() => {
        setOpen(false);
        if (status === 'Connecting') {
          disconnect();
        }
        setQRCodeWallet(void 0);
        setDisplay('single');
      }}
      handleBack={() => setDisplay('list')}
    />,
    getModalContent(),
  ];
};

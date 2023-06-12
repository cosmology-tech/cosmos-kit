import { ConnectModalHead, ConnectModalStatus } from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';

import { ModalViewImpl } from './config';

export function ConnectingView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const {
    walletInfo: { prettyName, mode },
    message,
  } = wallet;

  let title = 'Requesting Connection';
  let desc: string =
    mode === 'wallet-connect'
      ? `Approve ${prettyName} connection request on your mobile.`
      : `Open the ${prettyName} browser extension to connect your wallet.`;

  if (message === 'InitClient') {
    title = 'Initializing Wallet Client';
    desc = '';
  }

  const modalHead = (
    <ConnectModalHead
      title={prettyName}
      hasBackButton={true}
      onClose={onClose}
      onBack={onReturn}
    />
  );

  const modalContent = (
    <ConnectModalStatus
      status="Connecting"
      wallet={{
        name: wallet.walletInfo.name,
        prettyName: wallet.walletInfo.prettyName,
        logo: wallet.walletInfo.logo,
        isMobile: wallet.walletInfo.mode === 'wallet-connect',
        mobileDisabled: wallet.walletInfo.mobileDisabled,
      }}
      contentHeader={title}
      contentDesc={desc}
    />
  );

  return { head: modalHead, content: modalContent };
}

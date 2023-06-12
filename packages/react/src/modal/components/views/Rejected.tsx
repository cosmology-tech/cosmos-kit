import { ConnectModalHead, ConnectModalStatus } from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';

import { ModalViewImpl } from './config';

export function RejectedView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const {
    walletInfo: { prettyName },
  } = wallet;

  const onReconnect = () => {
    wallet.connect(false);
  };

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
      status="Rejected"
      wallet={{
        name: wallet.walletInfo.name,
        prettyName: wallet.walletInfo.prettyName,
        logo: wallet.walletInfo.logo,
        isMobile: wallet.walletInfo.mode === 'wallet-connect',
        mobileDisabled: wallet.walletInfo.mobileDisabled,
      }}
      contentHeader={'Request Rejected'}
      contentDesc={
        wallet.rejectMessageTarget || 'Connection permission is denied.'
      }
      onConnect={onReconnect}
    />
  );

  return { head: modalHead, content: modalContent };
}

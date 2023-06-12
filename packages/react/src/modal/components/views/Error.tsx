import { ConnectModalHead, ConnectModalStatus } from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';

import { ModalViewImpl } from './config';

export function ErrorView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const {
    walletInfo: { prettyName, logo },
    message,
  } = wallet;

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
      status="Error"
      wallet={{
        name: wallet.walletInfo.name,
        prettyName: wallet.walletInfo.prettyName,
        logo: wallet.walletInfo.logo,
        isMobile: wallet.walletInfo.mode === 'wallet-connect',
        mobileDisabled: wallet.walletInfo.mobileDisabled,
      }}
      contentHeader={'Oops! Something wrong...'}
      contentDesc={message}
      onChangeWallet={onReturn}
    />
  );

  return { head: modalHead, content: modalContent };
}

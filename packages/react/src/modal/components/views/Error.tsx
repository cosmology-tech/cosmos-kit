import { WalletViewProps } from '@cosmos-kit/core';
import { ConnectModalHead, ConnectModalStatus } from '@interchain-ui/react';

import { getWalletProp, ModalViewImpl } from './config';

export function ErrorView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const {
    walletInfo: { prettyName },
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
      wallet={getWalletProp(wallet.walletInfo)}
      contentHeader={'Oops! Something wrong...'}
      contentDesc={message}
      onChangeWallet={onReturn}
    />
  );

  return { head: modalHead, content: modalContent };
}

import { WalletViewProps } from '@cosmos-kit/core';
import { ConnectModalHead, ConnectModalStatus } from '@interchain-ui/react';

import { getWalletProp, ModalViewImpl } from './config';

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
      wallet={getWalletProp(wallet.walletInfo)}
      contentHeader={'Request Rejected'}
      contentDesc={
        wallet.rejectMessageTarget || 'Connection permission is denied.'
      }
      onConnect={onReconnect}
    />
  );

  return { head: modalHead, content: modalContent };
}

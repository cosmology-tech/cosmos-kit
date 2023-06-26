import { ConnectModalHead, ConnectModalStatus } from '@cosmology-ui/react';
import { WalletViewProps } from '@cosmos-kit/core';

import { AstronautSvg } from '../Astronaut';
import { ModalViewImpl } from './config';

export function ConnectedView({
  onClose,
  onReturn,
  wallet,
}: WalletViewProps): ModalViewImpl {
  const { walletInfo, username, address } = wallet;

  const onDisconnect = () => wallet.disconnect(true);

  const modalHead = (
    <ConnectModalHead
      title={walletInfo.prettyName}
      hasBackButton={true}
      onClose={onClose}
      onBack={onReturn}
    />
  );

  const modalContent = (
    <ConnectModalStatus
      wallet={{
        name: walletInfo.name,
        prettyName: walletInfo.prettyName,
        logo: walletInfo.logo,
        isMobile: walletInfo.mode === 'wallet-connect',
        mobileDisabled: walletInfo.mobileDisabled,
      }}
      status="Connected"
      connectedInfo={{
        name: username,
        avatar: (
          <AstronautSvg
            style={{
              fontSize: 'inherit',
              width: '100%',
              height: '100%',
            }}
          />
        ),
        address,
      }}
      onDisconnect={onDisconnect}
    />
  );

  return { head: modalHead, content: modalContent };
}

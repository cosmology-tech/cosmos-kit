/* eslint-disable @next/next/no-img-element */

import {
  SimpleConnectModal,
  SimpleDisplayWalletList,
  SimpleModalHead,
  Wallet,
} from '@cosmology-ui/react';
import { ChainWalletBase } from '@cosmos-kit/core';
import { useRef } from 'react';

export const WalletList = ({
  onClose,
  onWalletClicked,
  wallets,
}: {
  onClose: () => void;
  onWalletClicked: (name: string) => void;
  wallets: ChainWalletBase[];
}) => {
  const initialFocus = useRef();

  const modalHead = (
    <SimpleModalHead
      title="Select your wallet"
      backButton={false}
      onClose={onClose}
    />
  );

  const walletsData = wallets
    .map(
      (w) =>
        ({
          ...w.walletInfo,
          downloads: void 0,
          onClick: async () => {
            onWalletClicked(w.walletName);
          },
        } as Wallet)
    )
    .sort((a, b) => {
      if (a.mode === b.mode) {
        return 0;
      } else if (a.mode !== 'wallet-connect') {
        return -1;
      } else {
        return 1;
      }
    });

  const modalContent = (
    <SimpleDisplayWalletList
      initialFocus={initialFocus}
      walletsData={walletsData}
    />
  );

  return (
    <SimpleConnectModal
      modalOpen={true}
      modalOnClose={onClose}
      modalHead={modalHead}
      modalContent={modalContent}
      initialRef={initialFocus}
    />
  );
};

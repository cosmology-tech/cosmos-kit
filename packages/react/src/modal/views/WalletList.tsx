/* eslint-disable @next/next/no-img-element */

import {
  SimpleDisplayWalletList,
  SimpleModalHead,
  SimpleModalView,
  Wallet,
} from '@cosmology-ui/react';
import { ChainWalletBase } from '@cosmos-kit/core';
import React, { useRef } from 'react';

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
    .sort((a, b) => {
      if (a.walletInfo.mode === b.walletInfo.mode) {
        return 0;
      } else if (a.walletInfo.mode !== 'wallet-connect') {
        return -1;
      } else {
        return 1;
      }
    })
    .map(
      (w, i) =>
        ({
          ...w.walletInfo,
          downloads: void 0,
          onClick: async () => {
            onWalletClicked(w.walletName);
          },
          buttonShape: i < 2 ? 'Square' : 'Rectangle',
          subLogo:
            w.walletInfo.mode === 'wallet-connect'
              ? 'https://user-images.githubusercontent.com/545047/202090621-bb110635-f6ce-4aa0-a4e5-a03beac29bd1.svg'
              : void 0,
        } as Wallet)
    );

  const modalContent = (
    <SimpleDisplayWalletList
      initialFocus={initialFocus}
      walletsData={walletsData}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};

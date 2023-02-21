/* eslint-disable @next/next/no-img-element */

import {
  SimpleDisplayWalletList,
  SimpleModalHead,
  SimpleModalView,
  Wallet,
} from '@cosmology-ui/react';
import { ChainWalletBase, WalletListViewProps } from '@cosmos-kit/core';
import React, { useCallback, useRef } from 'react';

export const WalletListView = ({ onClose, wallets }: WalletListViewProps) => {
  const initialFocus = useRef();

  const onWalletClicked = useCallback((wallet: ChainWalletBase) => {
    wallet.connect(void 0, void 0, true);
  }, []);

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
            onWalletClicked(w);
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

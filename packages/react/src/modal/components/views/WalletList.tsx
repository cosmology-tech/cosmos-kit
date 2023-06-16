import {
  SimpleDisplayWalletList,
  SimpleModalHead,
  SimpleModalView,
  Wallet,
} from '@cosmology-ui/react';
import { ChainWalletBase, WalletListViewProps } from '@cosmos-kit/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WC_ICON } from 'src/modal/constant';

export const WalletListView = ({
  onClose,
  wallets,
  initialFocus,
}: WalletListViewProps) => {
  const defaultInitialFocus = useRef();
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const onWalletClicked = useCallback(async (wallet: ChainWalletBase) => {
    await wallet.connect(true);
    if (wallet.isWalletConnected) {
      onClose();
    }
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth >= 768) {
        setIsLargeScreen(true);
      } else {
        setIsLargeScreen(false);
      }
    };
    handleWindowResize();

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const modalHead = (
    <SimpleModalHead
      title="Select your wallet"
      backButton={false}
      onClose={onClose}
    />
  );

  const walletsData = useMemo(
    () =>
      wallets
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
              buttonShape: i < 2 && isLargeScreen ? 'Square' : 'Rectangle',
              subLogo:
                w.walletInfo.mode === 'wallet-connect' ? WC_ICON : void 0,
            } as Wallet)
        ),
    [wallets, isLargeScreen]
  );

  const modalContent = (
    <SimpleDisplayWalletList
      initialFocus={initialFocus || defaultInitialFocus}
      walletsData={walletsData}
    />
  );

  return <SimpleModalView modalHead={modalHead} modalContent={modalContent} />;
};

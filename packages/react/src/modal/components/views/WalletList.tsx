import {
  ConnectModalHead,
  ConnectModalWalletList,
  ConnectModalWalletListProps,
} from '@cosmology-ui/react';
import { ChainWalletBase, WalletListViewProps } from '@cosmos-kit/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWalletProp } from './_utils';

interface DynamicWalletListProps {
  wallets: WalletListViewProps['wallets'];
  onClose: () => void;
}

function DynamicWalletList({ wallets, onClose }: DynamicWalletListProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const onWalletClicked = useCallback(async (wallet: ChainWalletBase) => {
    await wallet.connect(true);

    if (wallet.isWalletConnected) {
      setTimeout(() => {
        onClose();
      }, 200);
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

  const walletsData: ConnectModalWalletListProps['wallets'] = useMemo(
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
        .map((wallet, i) => {
          return {
            ...getWalletProp(wallet.walletInfo),
            // subLogo can either be 'walletConnect' or a valid <img /> src attribute
            subLogo:
              wallet.walletInfo.mode === 'wallet-connect'
                ? 'walletConnect'
                : undefined,
            downloadUrl: '',
            originalWallet: wallet,
            shape: i < 2 && isLargeScreen ? 'square' : 'list',
          };
        }),
    [wallets, isLargeScreen]
  );

  return (
    <ConnectModalWalletList
      wallets={walletsData}
      onWalletItemClick={onWalletClicked}
    />
  );
}

export function WalletListView({
  onClose,
  wallets,
  initialFocus,
}: WalletListViewProps) {
  const modalHead = (
    <ConnectModalHead
      title="Select your wallet"
      hasBackButton={false}
      onClose={onClose}
    />
  );

  const modalContent = (
    <DynamicWalletList wallets={wallets} onClose={onClose} />
  );

  return { head: modalHead, content: modalContent };
}

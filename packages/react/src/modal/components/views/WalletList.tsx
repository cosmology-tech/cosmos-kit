import { ChainWalletBase, WalletListViewProps } from '@cosmos-kit/core';
import { ConnectModalHead, ConnectModalWalletList } from '@interchain-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSelectedWalletRepoContext } from '../../../context';
import { getWalletProp } from './config';

interface DynamicWalletListProps {
  wallets: WalletListViewProps['wallets'];
  onClose: () => void;
}

function DynamicWalletList({ wallets, onClose }: DynamicWalletListProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  const { selectWalletRepoName } = useSelectedWalletRepoContext();

  const onWalletClicked = useCallback(async (wallet: ChainWalletBase) => {
    selectWalletRepoName(wallet.walletName);
    await wallet.connect(wallet.walletStatus !== 'NotExist');
    if (!['Rejected', 'NotExist'].includes(wallet.walletStatus)) {
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

  const walletsData = useMemo(
    () =>
      wallets
        .sort((a, b) => {
          if (
            a.walletInfo.mode !== 'wallet-connect' &&
            b.walletInfo.mode !== 'wallet-connect'
          ) {
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
            btmLogo:
              typeof wallet.walletInfo.logo === 'object'
                ? wallet.walletInfo.logo.minor
                : wallet.walletInfo.extends,
            badge: { MetaMask: 'SNAP' }[wallet.walletInfo.extends],
            shape: (i < 2 && isLargeScreen ? 'square' : 'list') as
              | 'square'
              | 'list',
            downloadUrl: '',
            originalWallet: wallet,
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

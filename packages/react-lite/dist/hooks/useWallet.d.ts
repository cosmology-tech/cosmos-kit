import { WalletName, WalletContext } from '@cosmos-kit/core';

declare const useWallet: (walletName?: WalletName, activeOnly?: boolean) => WalletContext;

export { useWallet };

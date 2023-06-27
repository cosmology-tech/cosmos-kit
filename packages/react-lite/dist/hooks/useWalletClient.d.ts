import { WalletName, WalletClientContext } from '@cosmos-kit/core';

declare const useWalletClient: (walletName?: WalletName) => WalletClientContext;

export { useWalletClient };

import { preferredEndpoints } from './config';
import { foxwalletMobileInfo, FoxWalletMobileWallet } from './wallet-connect';

const foxwalletMobile = new FoxWalletMobileWallet(
  foxwalletMobileInfo,
  preferredEndpoints
);

export const wallets = [foxwalletMobile];

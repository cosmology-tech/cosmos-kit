import { preferredEndpoints } from './config';
import { keplrExtensionInfo, KeplrExtensionWallet } from './extension';
import { keplrMobileInfo, KeplrMobileWallet } from './wallet-connect';

const keplrExtension = new KeplrExtensionWallet(
  keplrExtensionInfo,
  preferredEndpoints
);
const keplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrExtension, keplrMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

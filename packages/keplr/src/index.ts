import { preferredEndpoints } from './config';
import { keplrExtensionInfo, KeplrExtensionWallet } from '../../keplr-extension';
import { keplrMobileInfo, KeplrMobileWallet } from '../../keplr-mobile';

const keplrExtension = new KeplrExtensionWallet(
  keplrExtensionInfo,
  preferredEndpoints
);
const keplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrExtension, keplrMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

import { preferredEndpoints } from './config';
import { keplrExtensionInfo, KeplrExtensionWallet } from './extension';
import { keplrMobileInfo, KeplrMobileWallet } from './wallet-connect';

const keplrExtension = new KeplrExtensionWallet(
  keplrExtensionInfo,
  preferredEndpoints
);
const KeplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrExtension, KeplrMobile];

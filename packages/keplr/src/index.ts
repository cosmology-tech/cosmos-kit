import {
  keplrExtensionInfo,
  KeplrExtensionWallet,
} from '@cosmos-kit/keplr-extension';
import { keplrMobileInfo, KeplrMobileWallet } from '@cosmos-kit/keplr-mobile';

import { preferredEndpoints } from './config';

const keplrExtension = new KeplrExtensionWallet(
  keplrExtensionInfo,
  preferredEndpoints
);
const keplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrExtension, keplrMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

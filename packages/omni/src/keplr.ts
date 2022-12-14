import { preferredEndpoints } from './config';
import { omniExtensionInfo, OmniExtensionWallet } from './extension';
import { omniMobileInfo, OmniMobileWallet } from './wallet-connect';

const omniExtension = new OmniExtensionWallet(
  omniExtensionInfo,
  preferredEndpoints
);
const omniMobile = new OmniMobileWallet(omniMobileInfo, preferredEndpoints);

export const wallets = [omniExtension, omniMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

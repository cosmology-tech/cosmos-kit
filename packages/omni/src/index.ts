import { preferredEndpoints } from './config';
import { omniMobileInfo, OmniMobileWallet } from '@cosmos-kit/omni-mobile';

const omniMobile = new OmniMobileWallet(omniMobileInfo, preferredEndpoints);

export const wallets = [omniMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

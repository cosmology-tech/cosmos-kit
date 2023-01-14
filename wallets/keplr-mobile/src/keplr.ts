import { preferredEndpoints } from './config';
import { keplrMobileInfo, KeplrMobileWallet } from './wallet-connect';

const keplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrMobile];

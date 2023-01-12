import { preferredEndpoints } from './config';
import { keplrMobileInfo, KeplrMobileWallet } from './wallet-connect';

const keplrMobile = new KeplrMobileWallet(keplrMobileInfo, preferredEndpoints);

export const wallets = [keplrMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

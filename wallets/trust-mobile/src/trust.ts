import { trustMobileInfo, TrustMobileWallet } from './wallet-connect';

const trustMobile = new TrustMobileWallet(trustMobileInfo);

export const wallets = [trustMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

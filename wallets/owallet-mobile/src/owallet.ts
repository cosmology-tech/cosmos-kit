import { owalletMobileInfo, OWalletMobileWallet } from './wallet-connect';

const owalletMobile = new OWalletMobileWallet(owalletMobileInfo);

export const wallets = [owalletMobile];

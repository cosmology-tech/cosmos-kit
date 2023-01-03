import {
  cosmostationMobileInfo,
  CosmostationMobileWallet,
} from './wallet-connect';

const cosmostationMobile = new CosmostationMobileWallet(cosmostationMobileInfo);

export const wallets = [cosmostationMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

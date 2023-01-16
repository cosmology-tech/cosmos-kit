import {
  cosmostationMobileInfo,
  CosmostationMobileWallet,
} from './wallet-connect';

const cosmostationMobile = new CosmostationMobileWallet(cosmostationMobileInfo);

export const wallets = [cosmostationMobile];

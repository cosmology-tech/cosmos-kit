import {
  cosmostationMobileInfo,
  CosmostationMobileWallet,
} from './extension';

const cosmostationMobile = new CosmostationMobileWallet(cosmostationMobileInfo);

export const wallets = [cosmostationMobile];

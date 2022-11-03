import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from './extension';
import {
  cosmostationMobileInfo,
  CosmostationMobileWallet,
} from './wallet-connect';

const cosmostationExtension = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);
const cosmostationMobile = new CosmostationMobileWallet(cosmostationMobileInfo);

export const wallets = [cosmostationExtension, cosmostationMobile];

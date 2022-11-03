import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from './extension';
import { CosmostationMobileWallet } from './wallet-connect';

const cosmostationExtension = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);
const cosmostationMobile = new CosmostationMobileWallet();

export const wallets = [cosmostationExtension, cosmostationMobile];

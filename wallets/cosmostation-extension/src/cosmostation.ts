import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from './extension';

const cosmostationExtension = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);

export const wallets = [cosmostationExtension];

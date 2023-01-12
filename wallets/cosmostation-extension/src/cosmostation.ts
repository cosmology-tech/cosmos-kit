import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from './extension';

const cosmostationExtension = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);

export const wallets = [cosmostationExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);

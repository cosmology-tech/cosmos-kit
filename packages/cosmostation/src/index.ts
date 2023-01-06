import {
  cosmostationExtensionInfo,
  CosmostationExtensionWallet,
} from '@cosmos-kit/cosmostation-extension';
import {
  cosmostationMobileInfo,
  CosmostationMobileWallet,
} from '@cosmos-kit/cosmostation-mobile';

const cosmostationExtension = new CosmostationExtensionWallet(
  cosmostationExtensionInfo
);
const cosmostationMobile = new CosmostationMobileWallet(cosmostationMobileInfo);

export const wallets = [cosmostationExtension, cosmostationMobile];
export const walletNames = wallets.map((wallet) => wallet.walletName);

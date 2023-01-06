import {
  vectisExtensionInfo,
  VectisExtensionWallet,
} from '@cosmos-kit/vectis-extension';

const vectisExtension = new VectisExtensionWallet(vectisExtensionInfo);

export const wallets = [vectisExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);

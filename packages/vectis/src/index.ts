import { vectisExtensionInfo, VectisExtensionWallet } from '../../vectis-extension';

const vectisExtension = new VectisExtensionWallet(vectisExtensionInfo);

export const wallets = [vectisExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);

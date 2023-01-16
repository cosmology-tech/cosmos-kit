import { vectisExtensionInfo, VectisExtensionWallet } from './extension';

const vectisExtension = new VectisExtensionWallet(vectisExtensionInfo);

export const wallets = [vectisExtension];

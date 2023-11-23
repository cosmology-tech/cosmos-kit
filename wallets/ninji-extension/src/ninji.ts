import { ninjiExtensionInfo, NinjiExtensionWallet } from './extension';

const ninjiExtension = new NinjiExtensionWallet(ninjiExtensionInfo);

export const wallets = [ninjiExtension];

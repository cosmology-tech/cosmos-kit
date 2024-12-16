import { ctrlExtensionInfo, CTRLExtensionWallet } from './extension';

const ctrlExtension = new CTRLExtensionWallet(ctrlExtensionInfo);

export const wallets = [ctrlExtension];

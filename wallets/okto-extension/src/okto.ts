import { oktoExtensionInfo, OktoExtensionWallet } from './extension';

const oktoExtension = new OktoExtensionWallet(oktoExtensionInfo);

export const wallets = [oktoExtension];

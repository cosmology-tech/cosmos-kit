import {
  terrastationExtensionInfo,
  TerrastationExtensionWallet,
} from './extension';

const terrastationExtension = new TerrastationExtensionWallet(
  terrastationExtensionInfo
);

export const wallets = [terrastationExtension];

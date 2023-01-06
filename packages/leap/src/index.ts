import {
  leapExtensionInfo,
  LeapExtensionWallet,
} from '@cosmos-kit/leap-extension';

const leapExtension = new LeapExtensionWallet(leapExtensionInfo);

export const wallets = [leapExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);

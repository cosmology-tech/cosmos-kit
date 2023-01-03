import { leapExtensionInfo, LeapExtensionWallet } from '../../leap-extension';

const leapExtension = new LeapExtensionWallet(leapExtensionInfo);

export const wallets = [leapExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);
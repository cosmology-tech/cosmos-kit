import { leapExtensionInfo, LeapExtensionWallet } from './extension';

const leapExtension = new LeapExtensionWallet(leapExtensionInfo);

export const wallets = [leapExtension];

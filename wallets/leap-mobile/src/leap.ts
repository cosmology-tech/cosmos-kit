import { LeapMobileInfo, LeapMobileWallet } from './wallet-connect';

const leapMobile = new LeapMobileWallet(LeapMobileInfo);

export const wallets = [leapMobile];

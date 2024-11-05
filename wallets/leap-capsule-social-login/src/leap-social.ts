import { LeapCapsuleInfo } from '@leapwallet/cosmos-social-login-capsule-provider';

import { LeapCapsuleWallet } from './main-wallet';

const leapSocial = new LeapCapsuleWallet(LeapCapsuleInfo);

export const wallets = [leapSocial];

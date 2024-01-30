import { Wallet } from '@cosmos-kit/core';
import { LEAP_SOCIAL_LOGIN_LOGO } from './constant';

export const LeapSocialLoginInfo: Wallet = {
  name: 'leap-capsule-social-login',
  prettyName: 'Sign In with Email',
  logo: `${LEAP_SOCIAL_LOGIN_LOGO}`,
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [],
};

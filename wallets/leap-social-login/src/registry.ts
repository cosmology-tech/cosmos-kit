import { Wallet } from '@cosmos-kit/core'

export const LeapCapsuleInfo: Wallet = {
  name: 'leap-cosmos-capsule',
  prettyName: 'Sign In with Email',
  logo: 'https://leap-wallet-assets.s3.amazonaws.com/social-login/mail.svg',
  mode: 'extension',
  mobileDisabled: false,
  rejectMessage: {
    source: 'Request rejected',
  },
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
    },
  ],
  connectEventNamesOnWindow: ['leap_keystorechange'],
}

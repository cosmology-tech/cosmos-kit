import { Wallet } from '@cosmos-kit/core';
import { RiChromeFill } from 'react-icons/ri';

export const leapExtensionInfo: Wallet = {
  name: 'leap-extension',
  logo: 'https://raw.githubusercontent.com/leapwallet/assets/2289486990e1eaf9395270fffd1c41ba344ef602/images/leap-cosmos-logo.png',
  prettyName: 'Leap Extension',
  mode: 'extension',
  mobileDisabled: true,
  downloads: {
    desktop: [
      {
        browser: 'chrome',
        icon: RiChromeFill,
        link: 'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
      },
    ],
    default:
      'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
  },
};

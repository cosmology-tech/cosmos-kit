import { Wallet } from '@cosmos-kit/core';

export const metamaskExtensionInfo: Wallet = {
  name: 'metamask-extension',
  logo:
    'https://lh3.googleusercontent.com/QW0gZ3yugzXDvTANa5-cc1EpabQ2MGnl6enW11O6kIerEaBQGOhgyUOvhRedndD9io8RJMmJZfIXq1rMxUsFHS2Ttw=w128-h128-e365-rj-sc0x00ffffff',
  prettyName: 'MetaMask',
  mode: 'extension',
  mobileDisabled: true,
  connectEventNamesOnWindow: [],
  downloads: [
    {
      device: 'desktop',
      browser: 'chrome',
      link:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
    {
      device: 'desktop',
      browser: 'firefox',
      link: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
    },
    {
      device: 'desktop',
      browser: 'brave',
      link:
        'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    },
    {
      device: 'desktop',
      browser: 'edge',
      link:
        'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm?hl=en-US',
    },
    {
      device: 'desktop',
      browser: 'opera',
      link: 'https://addons.opera.com/en-gb/extensions/details/metamask-10/',
    },
  ],
};

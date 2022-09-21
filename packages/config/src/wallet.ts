import { WalletInfo } from '@cosmos-kit/core';
import { ExtKeplrWallet, WCKeplrWallet } from '@cosmos-kit/keplr';
import { RiChromeFill, RiAppStoreFill } from "react-icons/ri";
import { GrFirefox } from "react-icons/gr";
import { FaAndroid } from "react-icons/fa";

export const walletInfos: WalletInfo[] = [
  {
    name: "keplr",
    active: false,
    logo: "https://pbs.twimg.com/profile_images/1498228570862219266/uctq7aeh_400x400.png",
    prettyName: "Keplr Wallet",
    wallet: new ExtKeplrWallet(),
    isQRCode: false,
    downloads: {
      desktop: [
        {
          browser: "chrome",
          icon: RiChromeFill,
          link: "https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap?hl=en",
        },
        {
          browser: "firefox",
          icon: GrFirefox,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      tablet: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      mobile: [
        {
          os: "android",
          icon: FaAndroid,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
        {
          os: "ios",
          icon: RiAppStoreFill,
          link: "https://addons.mozilla.org/en-US/firefox/addon/keplr/",
        },
      ],
      default: "https://www.keplr.app/download",
    },
  },
  {
    name: 'wc-keplr',
    active: false,
    wallet: new WCKeplrWallet(),
    prettyName: 'Keplr Mobile',
    logo: "https://user-images.githubusercontent.com/545047/191616515-eee176d0-9e50-4325-9529-6c0019d5c71a.png",
    isQRCode: true
  }
];

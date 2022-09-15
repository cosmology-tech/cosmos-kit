import { WalletRegistry } from '@cosmos-kit/core';
import { ExtKeplrWallet, WCKeplrWallet } from '@cosmos-kit/keplr';
import { RiChromeFill, RiAppStoreFill } from "react-icons/ri";
import { GrFirefox } from "react-icons/gr";
import { FaAndroid } from "react-icons/fa";

export const allWallets: WalletRegistry[] = [
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
    prettyName: 'Wallet Connect',
    logo: "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.png",
    isQRCode: true
  }
];

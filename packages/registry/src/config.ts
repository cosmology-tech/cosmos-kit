import { WalletRegistry } from '@cosmos-kit/core';
import { KeplrWallet, WCKeplrWallet } from '@cosmos-kit/wallets';

export const AllWallets: WalletRegistry[] = [
  {
    name: 'keplr',
    active: true,
    wallet: new KeplrWallet(),
    prettyName: 'Keplr Extension',
    describe: 'Keplr browser extension connect',
    logo: 'https://dummyimage.com/200x200/1624b5/fff.jpg&text=web',
  },
  {
    name: 'wc-keplr',
    active: true,
    wallet: new WCKeplrWallet(),
    prettyName: 'Keplr QR Code',
    describe: 'Keplr connect with QR Code',
    logo: 'ttps://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile',
  },
  // {
  //     name: "keplr mobile",
  //     Wallet: null,
  //     prettyName: "Keplr Mobile",
  //     logo: "https://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile",
  //     describe: "Keplr mobile QRcode connect",
  // }
];

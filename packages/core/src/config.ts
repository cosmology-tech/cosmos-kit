import { WalletRegistry, ChainRegistry } from "./types";
import { KeplrWallet, WCKeplrWallet } from "@cosmos-kit/wallets";
import { chains as rawChains } from "chain-registry";
import { Chain } from '@chain-registry/types';
import { WCWallet } from "@cosmos-kit/wallets";

function convert(chain: Chain): ChainRegistry {
    return {
        name: chain.chain_name,
        active: true,
        raw: chain
    }
}

export const chains: ChainRegistry[] = rawChains
    .filter(chain => chain.network_type !== 'testnet')
    .map(chain => convert(chain));

export const wallets: WalletRegistry[] = [
    {
        name: "keplr",
        active: true,
        wallet: new KeplrWallet(),
        prettyName: "Keplr Extension",
        describe: "Keplr browser extension connect",
        logo: "https://dummyimage.com/200x200/1624b5/fff.jpg&text=web",
    },
    {
        name: "wc-keplr",
        active: true,
        wallet: new WCKeplrWallet(),
        prettyName: "Keplr QR Code",
        describe: "Keplr connect with QR Code",
        logo: "ttps://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile",
    },
    {
        name: "wallet-connect",
        active: true,
        wallet: new WCWallet(),
        prettyName: "Wallet Connect",
        describe: "Wallet Connect with QR Code",
        logo: "ttps://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile",
    }
    // {
    //     name: "keplr mobile",
    //     Wallet: null,
    //     prettyName: "Keplr Mobile",
    //     logo: "https://dummyimage.com/200x200/1624b5/fff.jpg&text=mobile",
    //     describe: "Keplr mobile QRcode connect",
    // }
];
import { KeplrExtensionWallet } from "./extension";
import { KeplrMobileWallet } from "./wallet-connect";

const keplrExtension = new KeplrExtensionWallet();
const KeplrMobile = new KeplrMobileWallet();

export const wallets = [keplrExtension, KeplrMobile];
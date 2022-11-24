import { trustExtensionInfo, TrustExtensionWallet } from './extension';

const trustExtension = new TrustExtensionWallet(trustExtensionInfo);

export const wallets = [trustExtension];
export const walletNames = wallets.map((wallet) => wallet.walletName);

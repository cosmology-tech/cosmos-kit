import { ChainWCV2 } from './chain-wallet';
import { WCClientV2 } from './client';
import { WCWalletV2 } from './main-wallet';
import { wcv2Info } from './registry';

const walletConnectV2 = new WCWalletV2(wcv2Info, ChainWCV2, WCClientV2);

export const wallets = [walletConnectV2];
export const walletNames = wallets.map((wallet) => wallet.walletName);

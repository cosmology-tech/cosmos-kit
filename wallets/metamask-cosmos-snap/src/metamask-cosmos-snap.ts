import { MetamaskCosmosSnapInfo, MetamaskCosmosSnapWallet } from './extension';

const metamaskCosmosSnap = new MetamaskCosmosSnapWallet(MetamaskCosmosSnapInfo);

export const wallets = [metamaskCosmosSnap];

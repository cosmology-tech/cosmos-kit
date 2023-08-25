import { metamaskCosmosSnapInfo, MetamaskCosmosSnapWallet } from './extension';

const metamaskCosmosSnap = new MetamaskCosmosSnapWallet(metamaskCosmosSnapInfo);

export const wallets = [metamaskCosmosSnap];

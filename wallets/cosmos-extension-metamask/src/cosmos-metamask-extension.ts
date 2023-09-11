import { cosmosSnapExtensionInfo, CosmosMetamaskExtensionWallet } from './extension';

const cosmosExtensionMetamaskExtension = new CosmosMetamaskExtensionWallet(cosmosSnapExtensionInfo);

export const wallets = [cosmosExtensionMetamaskExtension];

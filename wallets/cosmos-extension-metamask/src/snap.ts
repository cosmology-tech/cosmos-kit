import { cosmosSnapExtensionInfo, ChainCosmosExtensionMetamask } from './extension';

const cosmosExtensionMetamaskExtension = new ChainCosmosExtensionMetamask(cosmosSnapExtensionInfo);

export const wallets = [cosmosExtensionMetamaskExtension];

import { cosmosSnapExtensionInfo, ChainCosmosExtensionMetamaskSnap } from './extension';

const cosmosExtensionMetamaskExtension = new ChainCosmosExtensionMetamaskSnap(cosmosSnapExtensionInfo);

export const wallets = [cosmosExtensionMetamaskExtension];

import { preferredEndpoints } from './config';
import { Coin98ExtensionInfo, Coin98ExtensionWallet } from './extension';

const coin98Extension = new Coin98ExtensionWallet(
  Coin98ExtensionInfo,
  preferredEndpoints
);

export const wallets = [coin98Extension];

import { Coin98 } from './types.js';
import '@keplr-wallet/types';

declare const getCoin98FromExtension: () => Promise<Coin98 | undefined>;

export { getCoin98FromExtension };

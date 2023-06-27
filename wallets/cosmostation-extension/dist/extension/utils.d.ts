import { Cosmostation } from './types.js';
import '@cosmjs/proto-signing';
import '@keplr-wallet/types';

declare const getCosmostationFromExtension: () => Promise<Cosmostation | undefined>;

export { getCosmostationFromExtension };

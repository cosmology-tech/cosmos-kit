import { Vectis } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';
import '@keplr-wallet/types';

declare const getVectisFromExtension: () => Promise<Vectis | undefined>;

export { getVectisFromExtension };

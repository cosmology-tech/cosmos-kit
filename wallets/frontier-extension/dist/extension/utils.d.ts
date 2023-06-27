import { Frontier } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';

declare const getFrontierFromExtension: () => Promise<Frontier | undefined>;

export { getFrontierFromExtension };

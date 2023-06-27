import { Trust } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@keplr-wallet/types';

declare const getTrustFromExtension: () => Promise<Trust | undefined>;

export { getTrustFromExtension };

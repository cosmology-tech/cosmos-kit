import { Compass } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';
import '@keplr-wallet/types';

declare const getCompassFromExtension: () => Promise<Compass | undefined>;

export { getCompassFromExtension };

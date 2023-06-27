import { Leap } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';
import '@keplr-wallet/types';

declare const getLeapFromExtension: () => Promise<Leap | undefined>;

export { getLeapFromExtension };

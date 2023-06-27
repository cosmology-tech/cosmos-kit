import { XDEFI } from './types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';

declare const getXDEFIFromExtension: () => Promise<XDEFI | undefined>;

export { getXDEFIFromExtension };

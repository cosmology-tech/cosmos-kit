import { Exodus } from '../types.js';
import '@cosmjs/amino';
import '@cosmjs/proto-signing';
import '@cosmos-kit/core';

declare const getExodusFromExtension: () => Promise<Exodus | undefined>;

export { getExodusFromExtension };

import { ChainRecord } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';
export declare function suggestChain<T extends Keplr>(keplr: T, chainInfo: ChainRecord): Promise<T>;

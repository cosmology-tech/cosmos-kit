import { createRepo } from './bases';
import { Repo } from './bases';
import { ChainInfo, WalletInfo } from './types';

export type WalletRepo = Repo<WalletInfo>;
export type ChainRepo = Repo<ChainInfo>;

export const createWalletRepo = createRepo<WalletInfo>;
export const createChainRepo = createRepo<ChainInfo>;

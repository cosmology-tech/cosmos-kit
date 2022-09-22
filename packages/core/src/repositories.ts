import { createRepo } from './bases';
import { Repo } from './bases';
import { ChainRecord, WalletRecord } from './types';

export type WalletRepo = Repo<WalletRecord>;
export type ChainRepo = Repo<ChainRecord>;

export const createWalletRepo = createRepo<WalletRecord>;
export const createChainRepo = createRepo<ChainRecord>;

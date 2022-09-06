import { createRepo } from './bases';
import { Repo } from './bases';
import { ChainRegistry, WalletRegistry } from './types';

export type WalletRepo = Repo<WalletRegistry>;
export type ChainRepo = Repo<ChainRegistry>;

export const createWalletRepo = createRepo<WalletRegistry>;
export const createChainRepo = createRepo<ChainRegistry>;

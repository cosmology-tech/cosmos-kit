import { createRepo } from "./bases";
import { ChainRegistry, WalletRegistry } from "./types";
import { Repo } from "./bases";

export type WalletRepo = Repo<WalletRegistry>;
export type ChainRepo = Repo<ChainRegistry>;

export const createWalletRepo = createRepo<WalletRegistry>;
export const createChainRepo = createRepo<ChainRegistry>;
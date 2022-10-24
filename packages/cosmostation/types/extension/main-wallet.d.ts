import { Callbacks, ChainRecord, Wallet } from '@cosmos-kit/core';
import { MainWalletBase } from '@cosmos-kit/core';
import { Cosmostation } from './types';
import { ChainCosmostationExtension } from './chain-wallet';
import { CosmostationExtensionData } from './types';
export declare class CosmostationExtensionWallet extends MainWalletBase<
  Cosmostation,
  CosmostationExtensionData,
  ChainCosmostationExtension
> {
  constructor(walletInfo?: Wallet, chains?: ChainRecord[]);
  setChains(chains: ChainRecord[]): void;
  fetchClient(): Promise<Cosmostation>;
  update(callbacks?: Callbacks): Promise<void>;
}

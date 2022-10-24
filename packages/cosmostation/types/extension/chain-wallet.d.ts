import {
  Callbacks,
  ChainRecord,
  ChainWalletBase,
  Wallet,
} from '@cosmos-kit/core';
import { Cosmostation } from './types';
import { ChainCosmostationExtensionData } from './types';
export declare class ChainCosmostationExtension extends ChainWalletBase<
  Cosmostation,
  ChainCosmostationExtensionData
> {
  constructor(walletInfo: Wallet, chainInfo: ChainRecord);
  get username(): string | undefined;
  fetchClient(): Promise<Cosmostation>;
  update(callbacks?: Callbacks): Promise<void>;
}

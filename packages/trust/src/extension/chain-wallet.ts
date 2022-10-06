import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { ChainInfo, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { preferredEndpoints } from '../config';
import { TrustWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';
export class ChainKeplrExtension extends ChainWalletBase<
  Keplr,
  ChainKeplrExtensionData,
  TrustWallet
> {
  constructor(_chainRecord: ChainInfo, mainWallet: TrustWallet) {
    super(_chainRecord, mainWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Error);
    this.setMessage("This network is not supported by Trust Wallet");
  }
}

/* eslint-disable no-console */
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import { ChainInfo, ChainWalletBase, State } from '@cosmos-kit/core';
import { Keplr } from '@keplr-wallet/types';

import { preferredEndpoints } from '../config';
import { KeplrExtensionWallet } from './main-wallet';
import { ChainKeplrExtensionData } from './types';
export class ChainKeplrExtension extends ChainWalletBase<
  Keplr,
  ChainKeplrExtensionData,
  KeplrExtensionWallet
> {
  constructor(_chainRecord: ChainInfo, mainWallet: KeplrExtensionWallet) {
    super(_chainRecord, mainWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  async update() {
    this.setState(State.Pending);
    try {
      const keplr = await this.client;
      if (!keplr) {
        throw new Error('No Keplr Client found!');
      }

      const suggestChain = chainRegistryChainToKeplr(this.chain, [
        this.assetList,
      ]);

      if (preferredEndpoints[this.chain.chain_name]) {
        suggestChain.rest = preferredEndpoints[this.chain.chain_name].rest[0];
      }
      if (preferredEndpoints[this.chain.chain_name]) {
        suggestChain.rpc = preferredEndpoints[this.chain.chain_name].rpc[0];
      }

      // console.log(suggestChain);

      await keplr.experimentalSuggestChain(suggestChain);

      const key = await keplr.getKey(this.chainId);

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? keplr.getOfflineSigner(this.chainId)
          : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} keplr-extension connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}

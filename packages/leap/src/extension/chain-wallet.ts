import { ChainInfo, ChainWalletBase, State } from '@cosmos-kit/core';

import { LeapExtensionWallet } from './main-wallet';
import { ChainLeapExtensionData, Leap } from './types';
export class ChainLeapExtension extends ChainWalletBase<
  Leap,
  ChainLeapExtensionData,
  LeapExtensionWallet
> {
  constructor(_chainRecord: ChainInfo, mainWallet: LeapExtensionWallet) {
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
      const leap = await this.client;
      if (!leap) {
        throw new Error('No Leap Client found!');
      }

      // const suggestChain = chainRegistryChainToKeplr(this.chain, [
      //   this.assetList,
      // ]);

      // await leap.experimentalSuggestChain(suggestChain);

      const key = await leap.getKey(this.chainId);

      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? leap.getOfflineSigner(this.chainId)
          : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} leap-extension connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }
}

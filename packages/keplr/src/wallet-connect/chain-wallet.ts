/* eslint-disable no-console */
import { chainRegistryChainToKeplr } from '@chain-registry/keplr';
import {
  ChainInfo,
  ChainWalletBase,
  SessionOptions,
  State,
} from '@cosmos-kit/core';
import { KeplrWalletConnectV1 } from '@keplr-wallet/wc-client';
import WalletConnect from '@walletconnect/client';

import { preferredEndpoints } from '../config';
import { KeplrMobileWallet } from './main-wallet';
import { ChainKeplrMobileData } from './types';

export class ChainKeplrMobile extends ChainWalletBase<
  KeplrWalletConnectV1,
  ChainKeplrMobileData,
  KeplrMobileWallet
> {
  constructor(_chainRecord: ChainInfo, keplrWallet: KeplrMobileWallet) {
    super(_chainRecord, keplrWallet);
  }

  get client() {
    return this.mainWallet.client;
  }

  get connector(): WalletConnect {
    return this.client.connector as WalletConnect;
  }

  get isInSession() {
    return this.connector.connected;
  }

  get username(): string | undefined {
    return this.data?.username;
  }

  get qrUri() {
    return this.connector.uri;
  }

  private get emitter() {
    return this.mainWallet.emitter;
  }

  async connect(
    sessionOptions?: SessionOptions,
    callback?: () => void
  ): Promise<void> {
    if (!this.isInSession) {
      await this.connector.createSession();
      this.emitter.on('update', async () => {
        await this.update();
        if (sessionOptions.duration) {
          setTimeout(() => {
            this.disconnect();
          }, sessionOptions.duration);
        }
        callback?.();
      });
      this.emitter.on('disconnect', async () => {
        await this.disconnect();
      });
    } else {
      await this.update();
    }
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

      await keplr.experimentalSuggestChain(suggestChain);

      const key = await this.client.getKey(this.chainId);
      this.setData({
        address: key.bech32Address,
        username: key.name,
        offlineSigner: this.chainId
          ? this.client.getOfflineSigner(this.chainId)
          : undefined,
      });
      this.setState(State.Done);
    } catch (e) {
      console.error(
        `Chain ${this.chainName} keplr-qrcode connection failed! \n ${e}`
      );
      this.setState(State.Error);
      this.setMessage((e as Error).message);
    }
  }

  async disconnect() {
    if (this.connector.connected) {
      await this.connector.killSession();
    }
    this.reset();
  }
}

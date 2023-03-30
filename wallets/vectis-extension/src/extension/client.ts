/* eslint-disable @typescript-eslint/no-unused-vars */
import { Algo, StdSignDoc } from '@cosmjs/amino';
import {
  ChainRecord,
  DirectSignDoc,
  ExtendedHttpEndpoint,
  SignOptions,
  SignType,
  WalletClient,
} from '@cosmos-kit/core';
import { SignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import type { Vectis, VectisChainInfo } from './types';

export class VectisClient implements WalletClient {
  readonly client: Vectis;

  constructor(client: Vectis) {
    this.client = client;
  }

  async connect(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async enable(chainIds: string | string[]) {
    await this.connect(chainIds);
  }

  async getSimpleAccount(chainId: string) {
    const { address, username } = await this.getAccount(chainId);
    return {
      namespace: 'cosmos',
      chainId,
      address,
      username,
    };
  }

  async getAccount(chainId: string) {
    const {
      address,
      algo,
      pubkey,
      name,
      isNanoLedger,
    } = await this.client.getKey(chainId);
    return {
      username: name,
      address,
      algo: algo as Algo,
      pubkey,
      isNanoLedger,
    };
  }

  async getOfflineSigner(chainId: string, preferredSignType?: SignType) {
    switch (preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino(chainId);
      case 'direct':
        return this.getOfflineSignerDirect(chainId);
      default:
        return this.getOfflineSignerAmino(chainId);
    }
    // const key = await this.getAccount(chainId);
    // if (key.isNanoLedger) {
    //   return this.getOfflineSignerAmino(chainId);
    // }
    // return this.getOfflineSignerDirect(chainId);
  }

  getOfflineSignerAmino(chainId: string) {
    return this.client.getOfflineSignerAmino(chainId);
  }

  getOfflineSignerDirect(chainId: string) {
    return this.client.getOfflineSignerDirect(chainId);
  }

  async addChain({ chain, name, preferredEndpoints }: ChainRecord) {
    const firstFeeToken = chain.fees?.fee_tokens[0];
    const rpcEndpoint =
      preferredEndpoints?.rpc?.[0] || chain.apis?.rpc?.[0].address || '';
    const restEndpoint =
      preferredEndpoints?.rest?.[0] || chain.apis?.rest?.[0].address || '';
    const chainInfo: VectisChainInfo = {
      chainId: chain.chain_id,
      prettyName: chain.pretty_name,
      chainName: chain.chain_name,
      rpcUrl:
        typeof rpcEndpoint === 'string'
          ? rpcEndpoint
          : (rpcEndpoint as ExtendedHttpEndpoint).url,

      restUrl:
        typeof restEndpoint === 'string'
          ? restEndpoint
          : (restEndpoint as ExtendedHttpEndpoint).url,

      bech32Prefix: chain.bech32_prefix,
      bip44: {
        coinType: chain.slip44,
      },
      defaultFeeToken: firstFeeToken?.denom || '',
      defaultGasPrice: firstFeeToken?.average_gas_price || 0,
      testnet: chain.network_type === 'testnet',
      stakingToken: chain.staking?.staking_tokens[0].denom || '',
      feeTokens:
        chain.fees?.fee_tokens.map((feeToken) => ({
          denom: feeToken.denom,
          coinDecimals: 6,
        })) || [],
      gasPriceStep: {
        low: firstFeeToken?.low_gas_price || 0,
        average: firstFeeToken?.average_gas_price || 0,
        high: firstFeeToken?.low_gas_price || 0,
      },
    };
    await this.client.suggestChains([chainInfo]);
    const chains = await this.client.getSupportedChains();
    const result = chains.some((chain) => chain.chainId === chainInfo.chainId);
    if (!result) {
      throw new Error(`Failed to add chain ${name}.`);
    }
  }

  async signAmino(
    chainId: string,
    signer: string,
    signDoc: StdSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signAmino(signer, signDoc);
  }

  async signDirect(
    chainId: string,
    signer: string,
    signDoc: DirectSignDoc,
    signOptions?: SignOptions
  ) {
    return await this.client.signDirect(signer, signDoc as SignDoc);
  }
}

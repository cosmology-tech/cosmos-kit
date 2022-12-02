import { ChainRecord, WalletClient } from '@cosmos-kit/core';

import type { Vectis, VectisChainInfo } from './types';

export class VectisClient implements WalletClient {
  readonly client: Vectis;

  constructor(client: Vectis) {
    this.client = client;
  }

  async enable(chainIds: string | string[]) {
    await this.client.enable(chainIds);
  }

  async getAccount(chainId: string) {
    return await this.client.getKey(chainId);
  }

  getOfflineSigner(chainId: string) {
    return this.client.getOfflineSigner(chainId);
  }

  async addChain({ chain, name, preferredEndpoints }: ChainRecord) {
    const firstFeeToken = chain.fees?.fee_tokens[0];
    const chainInfo: VectisChainInfo = {
      chainId: chain.chain_id,
      prettyName: chain.pretty_name,
      chainName: chain.chain_name,
      rpcUrl:
        preferredEndpoints?.rpc?.[0] || chain.apis?.rpc?.[0].address || '',
      restUrl:
        preferredEndpoints?.rest?.[0] || chain.apis?.rest?.[0].address || '',
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
}

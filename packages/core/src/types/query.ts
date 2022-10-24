import {
  Coin,
  DecCoin,
} from 'interchain/types/codegen/cosmos/base/v1beta1/coin';
import { ParamsSDKType as DistributionParams } from 'interchain/types/codegen/cosmos/distribution/v1beta1/distribution';
// import mint from 'interchain/types/codegen/cosmos/mint/v1beta1/query';
import {
  ParamsSDKType as StakingParams,
  PoolSDKType,
} from 'interchain/types/codegen/cosmos/staking/v1beta1/staking';

export type CoinMap = Map<Coin['denom'], Coin['amount']>;
export type DecCoinMap = Map<DecCoin['denom'], DecCoin['amount']>;
export type Address = string;
export type AddressMap<T> = Map<Address, T>;

export interface ChainQueryResult {
  cosmos: {
    staking: {
      params?: StakingParams;
      pool?: PoolSDKType;
      delegator: {
        denom?: Coin['denom'];
        delegations?: AddressMap<Coin['amount']>;
        unbondingDelegations?: AddressMap<DecCoin['amount']>;
      };
    };
    bank: {
      supply?: CoinMap;
      balances?: CoinMap;
    };
    mint: {
      //   params?: mint.QueryParamsResponse['params'];
      inflation?: string;
      annualProvisions?: string;
    };
    distribution: {
      params?: DistributionParams;
      delegator: {
        totalRewards?: DecCoinMap;
        rewards?: AddressMap<DecCoinMap>;
      };
    };
  };
}

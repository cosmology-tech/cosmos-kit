import {
  Coin,
  DecCoin,
} from 'interchain/types/codegen/cosmos/base/v1beta1/coin';
import distribution from 'interchain/types/codegen/cosmos/distribution/v1beta1/query';
// import mint from 'interchain/types/codegen/cosmos/mint/v1beta1/query';
import staking from 'interchain/types/codegen/cosmos/staking/v1beta1/query';

export type CoinMap = Map<Coin['denom'], Coin['amount']>;
export type DecCoinMap = Map<DecCoin['denom'], DecCoin['amount']>;
export type Address = string;
export type AddressMap<T> = Map<Address, T>;

export interface ChainQueryResult {
  cosmos: {
    staking: {
      params?: staking.QueryParamsResponse['params'];
      pool?: staking.QueryPoolResponse['pool'];
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
      params?: distribution.QueryParamsResponse['params'];
      delegator: {
        totalRewards?: DecCoinMap;
        rewards?: AddressMap<DecCoinMap>;
      };
    };
  };
}

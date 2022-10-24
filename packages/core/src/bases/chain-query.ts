/* eslint-disable @typescript-eslint/no-explicit-any */
import { IntPretty, RatePretty } from '@keplr-wallet/unit';
import { cosmos } from 'interchain';
import { Coin } from 'interchain/types/codegen/cosmos/base/v1beta1/coin';

import { ChainQueryResult } from '../types';
import { checkInit, checkKey, sum, valuesApply } from '../utils';
import { ChainWalletBase } from './chain-wallet';

export class ChainQuery {
  chainWallet: ChainWalletBase<any, any>;
  result: ChainQueryResult;

  constructor(chainWallet: ChainWalletBase<any, any>) {
    this.chainWallet = chainWallet;

    this.result = {
      cosmos: {
        staking: {
          delegator: {},
        },
        bank: {},
        mint: {},
        distribution: {
          delegator: {},
        },
      },
    };
  }

  protected get queryClient(): ReturnType<
    typeof cosmos.ClientFactory.createLCDClient
  > {
    const fn = async () => {
      const queryClient = await this.chainWallet.getQueryClient();
      if (!queryClient) {
        throw new Error('QueryClient is undefined!');
      }
      return queryClient;
    };
    return fn();
  }

  protected get address(): Promise<string> {
    const fn = async () => {
      if (!this.chainWallet.address) {
        await this.chainWallet.connect();
      }
      if (!this.chainWallet.address) {
        throw new Error('Address is undefined!');
      }
      return this.chainWallet.address;
    };
    return fn();
  }

  get staking() {
    return this.result.cosmos.staking;
  }

  get stakingDelegator() {
    return this.staking.delegator;
  }

  protected get _delegations() {
    checkInit(
      this.stakingDelegator.delegations,
      'staking.delegator.delegations'
    );
    return this.stakingDelegator.delegations;
  }

  protected get _unbondingDelegations() {
    checkInit(
      this.stakingDelegator.unbondingDelegations,
      'staking.delegator.unbondingDelegations'
    );
    return this.stakingDelegator.unbondingDelegations;
  }

  protected get _pool() {
    checkInit(this.staking.pool, 'staking.pool');
    return this.staking.pool;
  }

  get bank() {
    return this.result.cosmos.bank;
  }

  protected get _supply() {
    checkInit(this.bank.supply, 'bank.supply');
    return this.bank.supply;
  }

  protected get _balances() {
    checkInit(this.bank.balances, 'bank.balances');
    return this.bank.balances;
  }

  get mint() {
    return this.result.cosmos.mint;
  }

  // protected get _mintParams() {
  //   checkInit(this.mint.params, 'mint.params');
  //   return this.mint.params;
  // }

  protected get _inflation() {
    checkInit(this.mint.inflation, 'mint.inflation');
    return this.mint.inflation;
  }

  protected get _annualProvisions() {
    checkInit(this.mint.annualProvisions, 'mint.annualProvisions');
    return this.mint.annualProvisions;
  }

  get distribution() {
    return this.result.cosmos.distribution;
  }

  protected get _distParams() {
    checkInit(this.distribution.params, 'distribution.params');
    return this.distribution.params;
  }

  get distDelegator() {
    return this.distribution.delegator;
  }

  protected get _totalRewards() {
    checkInit(
      this.distDelegator.totalRewards,
      'distribution.delegators.totalRewards'
    );
    return this.distDelegator.totalRewards;
  }

  /*
    conveniently used for calculations and display
    */

  get delegations() {
    return valuesApply(this._delegations, (amount) => new IntPretty(amount));
  }

  get unbondingDelegations() {
    return valuesApply(
      this._unbondingDelegations,
      (amount) => new IntPretty(amount)
    );
  }

  get totalDelegation() {
    return sum(this.delegations.values(), (prev, curr) => prev.add(curr));
  }

  get totalUnbondingDelegation() {
    return sum(this.unbondingDelegations.values(), (prev, curr) =>
      prev.add(curr)
    );
  }

  get bondedTokens() {
    return new IntPretty(this._pool.bonded_tokens);
  }

  get supply() {
    return valuesApply(this._supply, (amount) => new IntPretty(amount));
  }

  getSupplyOf(denom: Coin['denom']) {
    checkKey(this.supply, denom, 'bank.supply');
    return this.supply.get(denom);
  }

  get balances() {
    return valuesApply(this._balances, (amount) => new IntPretty(amount));
  }

  getBalanceOf(denom: Coin['denom']) {
    checkKey(this.balances, denom, 'bank.balances');
    return this.balances.get(denom);
  }

  // get blocksPerYear() {
  //   return new IntPretty(this._mintParams.blocksPerYear.toInt());
  // }

  get inflation() {
    return new RatePretty(this._inflation);
  }

  get annualProvisions() {
    return new IntPretty(this._annualProvisions);
  }

  get communityTax() {
    return new RatePretty(this._distParams.community_tax);
  }

  get totalRewards() {
    return valuesApply(this._totalRewards, (amount) => new IntPretty(amount));
  }

  getRewardsOf(denom: Coin['denom']) {
    checkKey(this.totalRewards, denom, 'distribution.delegators.totalRewards');
    return this.totalRewards.get(denom);
  }

  async updateStakingPool() {
    const pool = await (await this.queryClient).cosmos.staking.v1beta1.pool({});

    this.staking.pool = pool.pool;
  }

  async updateStakingParams() {
    const params = await (
      await this.queryClient
    ).cosmos.staking.v1beta1.params({});

    this.staking.params = params.params;
  }

  async updateStakingDelegations() {
    const delegations = await (
      await this.queryClient
    ).cosmos.staking.v1beta1.delegatorDelegations({
      delegatorAddr: await this.address,
      pagination: null,
    } as any);

    this.stakingDelegator.delegations = new Map(
      delegations.delegation_responses.map(({ delegation, balance }, index) => {
        if (index === 0) {
          this.stakingDelegator.denom = balance.denom;
        } else {
          if (this.stakingDelegator.denom !== balance.denom) {
            throw new Error(
              `Denom is different for differnt validators (${this.stakingDelegator.denom} vs ${balance.denom})`
            );
          }
        }
        return [delegation.validator_address, balance.amount];
      })
    );
  }

  async updateStakingUnbondingDelegations() {
    const delegations = await (
      await this.queryClient
    ).cosmos.staking.v1beta1.delegatorUnbondingDelegations({
      delegatorAddr: await this.address,
      pagination: null,
    } as any);

    this.stakingDelegator.delegations = new Map(
      delegations.unbonding_responses.map(({ validator_address, entries }) => {
        return [
          validator_address,
          sum(
            entries.map((entry) => parseFloat(entry.balance)),
            (p, c) => p + c
          ).toString(),
        ];
      })
    );
  }

  async updateBankSupply() {
    const supply = await (
      await this.queryClient
    ).cosmos.bank.v1beta1.totalSupply({ pagination: null } as any);

    this.bank.supply = new Map(
      supply.supply.map((coin) => [coin.denom, coin.amount])
    );
  }

  async updateBankBalances() {
    const balances = await (
      await this.queryClient
    ).cosmos.bank.v1beta1.allBalances({
      address: await this.address,
      pagination: null,
    } as any);

    this.bank.balances = new Map(
      balances.balances.map((coin) => [coin.denom, coin.amount])
    );
  }

  // async updateMintParams() {
  //   const params = await (
  //     await this.queryClient
  //   ).cosmos.mint.v1beta1.params({});

  //   this.mint.params = params.params;
  // }

  // async updateMintInflation() {
  //   const inflation = await (
  //     await this.queryClient
  //   ).cosmos.mint.v1beta1.inflation({});

  //   this.mint.inflation = new TextDecoder().decode(inflation.inflation);
  // }

  // async updateMintAnnualProvisions() {
  //   const annualProvisions = await (
  //     await this.queryClient
  //   ).cosmos.mint.v1beta1.annualProvisions({});

  //   this.mint.annualProvisions = new TextDecoder().decode(
  //     annualProvisions.annualProvisions
  //   );
  // }

  async updateDistributionParams() {
    const params = await (
      await this.queryClient
    ).cosmos.distribution.v1beta1.params({});

    this.distribution.params = params.params;
  }

  async updateDistributionDelegationRewards() {
    const rewards = await (
      await this.queryClient
    ).cosmos.distribution.v1beta1.delegationTotalRewards({
      delegatorAddress: await this.address,
    });

    this.distDelegator.totalRewards = new Map(
      rewards.total.map((decCoin) => [decCoin.denom, decCoin.amount])
    );
    this.distDelegator.rewards = new Map(
      rewards.rewards.map(({ validator_address, reward }) => [
        validator_address,
        new Map(reward.map((decCoin) => [decCoin.denom, decCoin.amount])),
      ])
    );
  }
}

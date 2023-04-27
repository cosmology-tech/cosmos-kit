import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient } from '@cosmjs/stargate';
import { WalletRepo } from '@cosmos-kit/core';
import { CosmosChainWallet } from './chain-wallet';

export class CosmosWalletRepo extends WalletRepo {
  protected _wallets: CosmosChainWallet[];

  constructor(repo: WalletRepo) {
    super(repo.chainRecord, []);
    Object.assign(this, repo);
  }

  get wallets(): CosmosChainWallet[] {
    return this._wallets;
  }

  getStargateClient = async (): Promise<StargateClient> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getStargateClient();
      } catch (error) {
        this.logger?.debug(
          `${(error as Error).name}: ${(error as Error).message}`
        );
      }
    }
    return Promise.reject(
      `Something wrong! Probably no valid RPC endpoint for chain ${this.chainName}.`
    );
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    for (const wallet of this.wallets) {
      try {
        return await wallet.getCosmWasmClient();
      } catch (error) {
        this.logger?.debug(
          `${(error as Error).name}: ${(error as Error).message}`
        );
      }
    }
    return Promise.reject(
      `Something wrong! Probably no valid RPC endpoint for chain ${this.chainName}.`
    );
  };
}

/* eslint-disable no-console */
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  SigningStargateClient,
  SigningStargateClientOptions,
} from '@cosmjs/stargate';

import { ChainRecord, ChainWalletDataBase, Wallet } from '../types';
import { WalletBase } from './wallet';

export abstract class ChainWalletBase<
  Client,
  Data extends ChainWalletDataBase
> extends WalletBase<Client, Data> {
  protected _walletInfo: Wallet;
  protected _chainInfo: ChainRecord;
  rpcEndpoints: string[];
  restEndpoints: string[];

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super();
    this._chainInfo = chainInfo;
    this._walletInfo = walletInfo;
    this.rpcEndpoints = [
      ...(chainInfo.preferredEndpoints?.rpc || []),
      `https://rpc.cosmos.directory/${this.chainName}`,
      ...(chainInfo.chain?.apis?.rpc?.map((e) => e.address) || []),
    ];
    this.restEndpoints = [
      ...(chainInfo.preferredEndpoints?.rest || []),
      `https://rest.cosmos.directory/${this.chainName}`,
      ...(chainInfo.chain?.apis?.rest?.map((e) => e.address) || []),
    ];
  }

  get walletInfo() {
    return this._walletInfo;
  }

  get chainInfo() {
    return this._chainInfo;
  }

  get chainName() {
    return this.chainInfo.name;
  }

  get stargateOptions(): SigningStargateClientOptions | undefined {
    return this.chainInfo.signerOptions?.stargate;
  }

  get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainInfo.signerOptions?.cosmwasm;
  }

  get chain() {
    return this.chainInfo.chain;
  }

  get assets() {
    return this.chainInfo.assetList.assets;
  }

  get assetList() {
    return this.chainInfo.assetList;
  }

  get chainId() {
    return this.chain?.chain_id;
  }

  get cosmwasmEnabled() {
    return this.chain?.codebase?.cosmwasm_enabled;
  }

  getRpcEndpoint = async (): Promise<string | undefined> => {
    for (const endpoint of this.rpcEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.status == 200) {
          return endpoint;
        }
      } catch (err) {
        console.error(`Failed to fetch RPC ${endpoint}`);
      }
    }
    return undefined;
  };

  getRestEndpoint = async (): Promise<string | undefined> => {
    for (const endpoint of this.restEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.status == 200) {
          return endpoint;
        }
      } catch (err) {
        console.error(`Failed to fetch REST ${endpoint}`);
      }
    }
    return undefined;
  };

  get address(): string | undefined {
    return this.data?.address;
  }

  get offlineSigner(): OfflineSigner | undefined {
    return this.data?.offlineSigner;
  }

  getStargateClient = async (): Promise<SigningStargateClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        this.offlineSigner,
        this.stargateOptions
      );
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return undefined;
  };

  getCosmWasmClient = async (): Promise<SigningCosmWasmClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        this.offlineSigner,
        this.cosmwasmOptions
      );
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return undefined;
  };
}

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

import { ChainInfo, ChainWalletDataBase, State, Wallet } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  WalletClient,
  ChainWalletData extends ChainWalletDataBase,
  MainWallet extends { walletInfo: Wallet }
> extends StateBase<ChainWalletData> {
  protected _chainInfo: ChainInfo;
  protected mainWallet: MainWallet;
  rpcEndpoints: string[];
  restEndpoints: string[];

  constructor(_chainInfo: ChainInfo, mainWallet: MainWallet) {
    super();
    this._chainInfo = _chainInfo;
    this.mainWallet = mainWallet;
    this.rpcEndpoints = [
      ...(_chainInfo.preferredEndpoints?.rpc || []),
      `https://rpc.cosmos.directory/${this.chainName}`,
      ...(_chainInfo.chain?.apis?.rpc?.map((e) => e.address) || []),
    ];
    this.restEndpoints = [
      ...(_chainInfo.preferredEndpoints?.rest || []),
      `https://rest.cosmos.directory/${this.chainName}`,
      ...(_chainInfo.chain?.apis?.rest?.map((e) => e.address) || []),
    ];
  }

  get walletInfo() {
    return this.mainWallet.walletInfo;
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

  disconnect() {
    this.reset();
  }

  async connect() {
    if (!(await this.client)) {
      this.setState(State.Error);
      this.setMessage('Client Not Exist!');
      return;
    }
    await this.update();
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
        this.stargateOptions
      );
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return undefined;
  };

  abstract get client():
    | Promise<WalletClient | undefined>
    | undefined
    | WalletClient;
}

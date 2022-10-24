/* eslint-disable no-console */
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import {
  calculateFee,
  GasPrice,
  SigningStargateClient,
  SigningStargateClientOptions,
  StdFee,
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { cosmos } from 'interchain';

import { ChainRecord, ChainWalletDataBase, Wallet } from '../types';
import { isValidEndpoint } from '../utils';
import { ChainQuery } from './chain-query';
import { WalletBase } from './wallet';

export abstract class ChainWalletBase<
  Client,
  Data extends ChainWalletDataBase
> extends WalletBase<Client, Data> {
  protected _chainInfo: ChainRecord;
  rpcEndpoints: string[];
  restEndpoints: string[];
  protected _rpcEndpoint?: string;
  protected _restEndpoint?: string;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo);
    this._chainInfo = chainInfo;
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
    if (this._rpcEndpoint && (await isValidEndpoint(this._rpcEndpoint))) {
      return this._rpcEndpoint;
    }
    for (const endpoint of this.rpcEndpoints) {
      if (await isValidEndpoint(endpoint)) {
        this._rpcEndpoint = endpoint;
        return endpoint;
      }
    }
    console.warn(`No valid RPC endpoint available!`);
    return void 0;
  };

  getRestEndpoint = async (): Promise<string | undefined> => {
    if (this._restEndpoint && (await isValidEndpoint(this._restEndpoint))) {
      return this._restEndpoint;
    }
    for (const endpoint of this.restEndpoints) {
      if (await isValidEndpoint(endpoint)) {
        this._restEndpoint = endpoint;
        return endpoint;
      }
    }
    console.warn(`No valid Rest endpoint available!`);
    return void 0;
  };

  get address(): string | undefined {
    return this.data?.address;
  }

  get offlineSigner(): OfflineSigner | undefined {
    return this.data?.offlineSigner;
  }

  getQueryClient = async () => {
    const restEndpoint = await this.getRestEndpoint();

    if (restEndpoint) {
      return await cosmos.ClientFactory.createLCDClient({
        restEndpoint,
      });
    }
    console.error('No valid restEndpoint.');
    return void 0;
  };

  getChainQuery = async () => {
    const restEndpoint = await this.getRestEndpoint();

    if (restEndpoint) {
      return new ChainQuery(restEndpoint);
    }
    console.error('No valid restEndpoint.');
    return void 0;
  };

  getSigningStargateClient = async (): Promise<
    SigningStargateClient | undefined
  > => {
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
    return void 0;
  };

  getSigningCosmWasmClient = async (): Promise<
    SigningCosmWasmClient | undefined
  > => {
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
    return void 0;
  };

  protected getSigningClient = async (type?: string) => {
    switch (type) {
      case 'stargate':
        return await this.getSigningStargateClient();
      case 'cosmwasm':
        return await this.getSigningCosmWasmClient();
      default:
        return this.getSigningStargateClient();
    }
  };

  estimateFee = async (
    messages: EncodeObject[],
    type?: string,
    memo?: string,
    multiplier?: number
  ) => {
    if (!this.address) {
      await this.connect();
    }

    let gasPrice: GasPrice;
    switch (type) {
      case 'stargate':
        gasPrice = this.stargateOptions?.gasPrice;
        break;
      case 'cosmwasm':
        gasPrice = this.cosmwasmOptions?.gasPrice;
        break;
      default:
        gasPrice = this.stargateOptions?.gasPrice;
        break;
    }

    if (!gasPrice) {
      throw new Error(
        'Gas price must be set in the client options when auto gas is used.'
      );
    }
    const client = await this.getSigningClient(type);
    const gasEstimation = await client.simulate(this.address, messages, memo);
    return calculateFee(
      Math.round(gasEstimation * (multiplier || 1.3)),
      gasPrice
    );
  };

  sign = async (
    messages: EncodeObject[],
    fee?: StdFee | number,
    memo?: string,
    type?: string
  ): Promise<TxRaw> => {
    if (!this.address) {
      await this.connect();
    }
    const client = await this.getSigningClient(type);
    let usedFee: StdFee;
    if (typeof fee === 'undefined' || typeof fee === 'number') {
      usedFee = await this.estimateFee(messages, type, memo, fee);
    } else {
      usedFee = fee;
    }
    return await client.sign(this.address, messages, usedFee, memo || '');
  };

  broadcast = async (signedMessages: TxRaw, type?: string) => {
    const client = await this.getSigningClient(type);
    const txBytes = TxRaw.encode(signedMessages).finish();

    let timeoutMs: number, pollIntervalMs: number;
    switch (type) {
      case 'stargate':
        timeoutMs = this.stargateOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.stargateOptions?.broadcastPollIntervalMs;
        break;
      case 'cosmwasm':
        timeoutMs = this.cosmwasmOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.cosmwasmOptions?.broadcastPollIntervalMs;
        break;
      default:
        timeoutMs = this.stargateOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.stargateOptions?.broadcastPollIntervalMs;
        break;
    }

    return client.broadcastTx(txBytes, timeoutMs, pollIntervalMs);
  };

  signAndBroadcast = async (
    messages: EncodeObject[],
    fee?: StdFee | number,
    memo?: string,
    type?: string
  ) => {
    const signedMessages = await this.sign(messages, fee, memo, type);
    return this.broadcast(signedMessages, type);
  };
}

/* eslint-disable no-console */
import {
  CosmWasmClient,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import {
  calculateFee,
  GasPrice,
  SigningStargateClient,
  SigningStargateClientOptions,
  StargateClient,
  StargateClientOptions,
  StdFee,
} from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

import {
  Callbacks,
  ChainRecord,
  ChainWalletData,
  SessionOptions,
  State,
  Wallet,
  WalletAccount,
  WalletClient,
} from '../types';
import { isValidEndpoint } from '../utils';
import { WalletBase } from './wallet';

export class ChainWalletBase extends WalletBase<ChainWalletData> {
  protected _chainInfo: ChainRecord;
  rpcEndpoints?: string[];
  restEndpoints?: string[];
  protected _rpcEndpoint?: string;
  protected _restEndpoint?: string;

  constructor(walletInfo: Wallet, chainInfo: ChainRecord) {
    super(walletInfo);
    this._chainInfo = chainInfo;
    this.rpcEndpoints = chainInfo.preferredEndpoints?.rpc;
    this.restEndpoints = chainInfo.preferredEndpoints?.rest;
  }

  get chainInfo() {
    return this._chainInfo;
  }

  get chainName() {
    return this.chainInfo.name;
  }

  get stargateOptions(): StargateClientOptions | undefined {
    return this.chainInfo.clientOptions?.stargate;
  }

  get signingStargateOptions(): SigningStargateClientOptions | undefined {
    return this.chainInfo.clientOptions?.signingStargate;
  }

  get signingCosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainInfo.clientOptions?.signingCosmwasm;
  }

  get chain() {
    return this.chainInfo.chain;
  }

  get assets() {
    return this.chainInfo.assetList?.assets;
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

  get username(): string | undefined {
    return this.data?.username;
  }

  get address(): string | undefined {
    return this.data?.address;
  }

  get offlineSigner(): OfflineSigner | undefined {
    return this.data?.offlineSigner;
  }

  fetchClient(): WalletClient | Promise<WalletClient | undefined> | undefined {
    console.warn(
      'This method should keep the same with the main walllet. If you see this message, please check your "onSetChainsDone" method in main wallet.'
    );
    return void 0;
  }

  async update(sessionOptions?: SessionOptions, callbacks?: Callbacks) {
    if (!this.client) {
      this.setClientNotExist();
      return;
    }

    this.setState(State.Pending);
    try {
      let account: WalletAccount;
      if (this.client.addChain) {
        try {
          account = await this.client.getAccount(this.chainId);
        } catch (error) {
          await this.client.addChain(this.chainInfo);
          account = await this.client.getAccount(this.chainId);
        }
      } else {
        account = await this.client.getAccount(this.chainId);
      }

      this.setData({
        address: account.address,
        username: account.name,
        offlineSigner: this.chainId
          ? await this.client.getOfflineSigner(this.chainId)
          : void 0,
      });
      this.setState(State.Done);

      if (sessionOptions?.duration) {
        setTimeout(() => {
          this.disconnect(callbacks);
        }, sessionOptions?.duration);
      }
    } catch (e) {
      if (
        this.walletInfo.rejectMessage &&
        (e as Error).message === this.walletInfo.rejectMessage?.source
      ) {
        this.setRejected();
      } else {
        this.setError(e as Error);
      }
    }
    callbacks?.connect?.();
  }

  getRpcEndpoint = async (): Promise<string | undefined> => {
    if (this._rpcEndpoint && (await isValidEndpoint(this._rpcEndpoint))) {
      return this._rpcEndpoint;
    }
    for (const endpoint of this.rpcEndpoints || []) {
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
    for (const endpoint of this.restEndpoints || []) {
      if (await isValidEndpoint(endpoint)) {
        this._restEndpoint = endpoint;
        return endpoint;
      }
    }
    console.warn(`No valid Rest endpoint available!`);
    return void 0;
  };

  getStargateClient = async (): Promise<StargateClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return StargateClient.connect(rpcEndpoint, this.stargateOptions);
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return void 0;
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return CosmWasmClient.connect(rpcEndpoint);
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return void 0;
  };

  getSigningStargateClient = async (): Promise<SigningStargateClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        this.offlineSigner,
        this.signingStargateOptions
      );
    } else {
      throw new Error('Undefined offlineSigner or rpcEndpoint.');
    }
  };

  getSigningCosmWasmClient = async (): Promise<SigningCosmWasmClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (this.offlineSigner && rpcEndpoint) {
      console.info('Using RPC endpoint ' + rpcEndpoint);
      return SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        this.offlineSigner,
        this.signingCosmwasmOptions
      );
    } else {
      throw new Error('Undefined offlineSigner or rpcEndpoint.');
    }
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
      throw new Error(
        'Address is required to estimate fee. Try connect to fetch address.'
      );
    }

    let gasPrice: GasPrice | undefined;
    switch (type) {
      case 'stargate':
        gasPrice = this.signingStargateOptions?.gasPrice;
        break;
      case 'cosmwasm':
        gasPrice = this.signingCosmwasmOptions?.gasPrice;
        break;
      default:
        gasPrice = this.signingStargateOptions?.gasPrice;
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
      throw new Error(
        'Address is required to estimate fee. Try connect to fetch address.'
      );
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

    let timeoutMs: number | undefined, pollIntervalMs: number | undefined;
    switch (type) {
      case 'stargate':
        timeoutMs = this.signingStargateOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.signingStargateOptions?.broadcastPollIntervalMs;
        break;
      case 'cosmwasm':
        timeoutMs = this.signingCosmwasmOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.signingCosmwasmOptions?.broadcastPollIntervalMs;
        break;
      default:
        timeoutMs = this.signingStargateOptions?.broadcastTimeoutMs;
        pollIntervalMs = this.signingStargateOptions?.broadcastPollIntervalMs;
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

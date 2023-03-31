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
import { ChainWalletBase, Namespace } from '@cosmos-kit/core';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { NameService } from './name-service';
import { CosmosClientType, CosmosSignType } from './types';
import { getNameServiceRegistryFromChainName } from './utils';

export class CosmosChainWallet extends ChainWalletBase {
  offlineSigner?: OfflineSigner;
  namespace: Namespace = 'cosmos';

  constructor(wallet: ChainWalletBase) {
    super(wallet.walletInfo, wallet.chainRecord);
    Object.assign(this, wallet);
  }

  get stargateOptions(): StargateClientOptions | undefined {
    return this.chainRecord.clientOptions?.stargate;
  }

  get signingStargateOptions(): SigningStargateClientOptions | undefined {
    return (
      this.chainRecord.clientOptions?.signingStargate ||
      this.chainRecord.clientOptions?.stargate
    );
  }

  get signingCosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainRecord.clientOptions?.signingCosmwasm;
  }

  get preferredSignType(): CosmosSignType {
    return this.chainRecord.clientOptions?.preferredSignType || 'amino';
  }

  getStargateClient = async (): Promise<StargateClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    return StargateClient.connect(rpcEndpoint, this.stargateOptions);
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    return CosmWasmClient.connect(rpcEndpoint);
  };

  getNameService = async (): Promise<NameService> => {
    const client = await this.getCosmWasmClient();
    const registry = getNameServiceRegistryFromChainName(this.chainName);
    return new NameService(client, registry);
  };

  initOfflineSigner = async (): Promise<void> => {
    if (typeof this.client === 'undefined') {
      throw new Error('WalletClient is not initialized');
    }
    this.offlineSigner = await this.client.getOfflineSigner(
      this.chainId,
      this.preferredSignType
    );
  };

  getSigningStargateClient = async (): Promise<SigningStargateClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (!this.offlineSigner) {
      await this.initOfflineSigner();
    }

    return SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      this.offlineSigner,
      this.signingStargateOptions
    );
  };

  getSigningCosmWasmClient = async (): Promise<SigningCosmWasmClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (!this.offlineSigner) {
      await this.initOfflineSigner();
    }

    return SigningCosmWasmClient.connectWithSigner(
      rpcEndpoint,
      this.offlineSigner,
      this.signingCosmwasmOptions
    );
  };

  protected getSigningClient = async (type?: CosmosClientType) => {
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
    type?: CosmosClientType,
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
    type?: CosmosClientType
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

  broadcast = async (signedMessages: TxRaw, type?: CosmosClientType) => {
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
    type?: CosmosClientType
  ) => {
    const signedMessages = await this.sign(messages, fee, memo, type);
    return this.broadcast(signedMessages, type);
  };
}

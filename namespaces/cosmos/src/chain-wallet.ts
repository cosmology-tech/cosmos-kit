import {
  CosmWasmClient,
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineDirectSigner } from '@cosmjs/proto-signing';
import {
  calculateFee,
  GasPrice,
  SigningStargateClient,
  SigningStargateClientOptions,
  StargateClient,
  StargateClientOptions,
  StdFee,
} from '@cosmjs/stargate';
import {
  ChainWalletBase,
  getUint8ArrayFromString,
  Mutable,
  State,
  WalletClient,
} from '@cosmos-kit/core';
import { SignDoc, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { CosmosClientType, CosmosSignType } from './types';
import { getNameServiceRegistryFromChainName } from './utils';
import { CosmosNameService } from './name-service';
import { CosmosSignature, CosmosWalletAccount } from './types';
import { AccountData, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';

export class CosmosChainWalletBase extends ChainWalletBase {
  clientMutable: Mutable<WalletClient> = { state: State.Init };

  constructor(wallet: ChainWalletBase) {
    super(wallet.walletInfo, wallet.chainRecord);
    Object.assign(this, wallet);
    if (this.namespace !== 'cosmos') {
      throw new Error('Should init with a Cosmos chain wallet.');
    }
  }

  get client() {
    return this.clientMutable?.data;
  }

  get cosmwasmEnabled() {
    return this.chain?.codebase?.cosmwasm_enabled;
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

  protected async _getAccount(): Promise<AccountData[]> {
    const accounts: CosmosWalletAccount[] = (await this.client?.getAccount({
      cosmos: { chainIds: [this.chainId] },
    })) as CosmosWalletAccount[];
    return accounts.map(
      ({ address, publicKey }) =>
        ({
          address: address.value,
          pubkey: getUint8ArrayFromString(publicKey.value, publicKey.encoding),
          algo: publicKey.algo,
        } as AccountData)
    );
  }

  getOfflineSignerAmino(): OfflineAminoSigner {
    return {
      getAccount: this._getAccount,
      signAmino: async (signerAddress: string, signDoc: StdSignDoc) => {
        const signature: CosmosSignature = (await this.client?.sign(
          'cosmos',
          this.chainId,
          signerAddress,
          signDoc
        )) as CosmosSignature;
        return {
          signed: (signature.signedDoc || signDoc) as StdSignDoc,
          signature: {
            signature: signature.signature.value,
            pub_key: signature.publicKey,
          },
        };
      },
    };
  }

  getOfflineSignerDirect(): OfflineDirectSigner {
    return {
      getAccount: this._getAccount,
      signDirect: async (signerAddress: string, signDoc: SignDoc) => {
        const signature: CosmosSignature = (await this.client?.sign(
          'cosmos',
          this.chainId,
          signerAddress,
          signDoc
        )) as CosmosSignature;
        return {
          signed: (signature.signedDoc || signDoc) as SignDoc,
          signature: {
            signature: signature.signature.value,
            pub_key: signature.publicKey,
          },
        };
      },
    };
  }

  get offlineSigner(): OfflineAminoSigner | OfflineDirectSigner {
    switch (this.preferredSignType) {
      case 'amino':
        return this.getOfflineSignerAmino();
      case 'direct':
        return this.getOfflineSignerDirect();
    }
  }

  getStargateClient = async (): Promise<StargateClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    return StargateClient.connect(rpcEndpoint, this.stargateOptions);
  };

  getCosmWasmClient = async (): Promise<CosmWasmClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();
    return CosmWasmClient.connect(rpcEndpoint);
  };

  getNameService = async (): Promise<CosmosNameService> => {
    const client = await this.getCosmWasmClient();
    const registry = getNameServiceRegistryFromChainName(this.chainName);
    return new CosmosNameService(client, registry);
  };

  getSigningStargateClient = async (): Promise<SigningStargateClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (!this.client) {
      return Promise.reject('WalletClient is not initialized');
    }

    return SigningStargateClient.connectWithSigner(
      rpcEndpoint,
      this.offlineSigner,
      this.signingStargateOptions
    );
  };

  getSigningCosmWasmClient = async (): Promise<SigningCosmWasmClient> => {
    const rpcEndpoint = await this.getRpcEndpoint();

    if (!this.client) {
      return Promise.reject('WalletClient is not initialized');
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

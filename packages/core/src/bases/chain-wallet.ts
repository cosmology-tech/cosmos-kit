import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import {
  SigningStargateClient,
  SigningStargateClientOptions,
} from '@cosmjs/stargate';

import { ChainRecord, ChainWalletDataBase, State } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  WalletClient,
  ChainWalletData extends ChainWalletDataBase,
  MainWallet
> extends StateBase<ChainWalletData> {
  protected _chainRecord: ChainRecord;
  protected mainWallet?: MainWallet;

  constructor(_chainRecord: ChainRecord, mainWallet?: MainWallet) {
    super();
    this._chainRecord = _chainRecord;
    this.mainWallet = mainWallet;
  }

  get chainRecord() {
    return this._chainRecord;
  }

  get chainName() {
    return this.chainRecord.name;
  }

  get stargateOptions(): SigningStargateClientOptions | undefined {
    return this.chainRecord.signerOptions?.stargate;
  }

  get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainRecord.signerOptions?.cosmwasm;
  }

  get chain() {
    return this.chainRecord.chain;
  }

  get chainId() {
    return this.chain?.chain_id;
  }

  get cosmwasmEnabled() {
    return this.chain?.codebase?.cosmwasm_enabled;
  }

  getRpcEndpoint = async (): Promise<string | undefined> => {
    const rpcs = [
      { address: `https://rpc.cosmos.directory/${this.chainName}` },
    ];
    rpcs.push(...this.chainRecord.chain?.apis?.rpc);

    for (const rpc of rpcs) {
      try {
        const response = await fetch(rpc.address);
        if (response.status == 200) {
          return rpc.address;
        }
      } catch (err) {
        console.error(err);
      }
    }
    return undefined;
  };

  getRestEndpoint = async (): Promise<string | undefined> => {
    const fn = async () => {
      const rests = [
        { address: `https://rest.cosmos.directory/${this.chainName}` },
      ];
      rests.push(...this.chainRecord.chain?.apis?.rest);

      for (const rest of rests) {
        try {
          const response = await fetch(rest.address);
          if (response.status == 200) {
            return rest.address;
          }
        } catch (err) {
          console.error(err);
        }
      }
      return undefined;
    };
    return fn();
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
      return SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        this.offlineSigner,
        this.stargateOptions
      );
    }
    console.error('Undefined offlineSigner or rpcEndpoint.');
    return undefined;
  };

  abstract get client(): Promise<WalletClient> | undefined | WalletClient;
}

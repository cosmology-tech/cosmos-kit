import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';

import { ChainRegistry, ChainWalletData, State } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  A,
  B extends ChainWalletData,
  C
> extends StateBase<B> {
  protected _chainRegistry: ChainRegistry;
  protected mainWallet?: C;

  constructor(_chainRegistry: ChainRegistry, mainWallet?: C) {
    super();
    this._chainRegistry = _chainRegistry;
    this.mainWallet = mainWallet;
  }

  get chainRegistry() {
    return this._chainRegistry;
  }

  get chainName() {
    return this.chainRegistry.name;
  }

  get stargateOptions(): SigningStargateClientOptions | undefined {
    return this.chainRegistry.options?.stargate(this.chainRaw);
  }

  get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainRegistry.options?.cosmwasm(this.chainRaw);
  }

  get chainRaw() {
    return this.chainRegistry.raw;
  }

  get chainId() {
    return this.chainRaw?.chain_id;
  }

  get cosmwasmEnabled() {
    return this.chainRaw?.codebase?.cosmwasm_enabled;
  }

  get rpcEndpoint(): Promise<string | undefined> {
    const fn = async () => {
      const rpcs = [
        { address: `https://rpc.cosmos.directory/${this.chainName}` }
      ];
      rpcs.push(...this.chainRegistry.raw?.apis?.rpc);

      for (const rpc of rpcs) {      
        try {
          const response = await fetch(rpc.address)
          if (response.status == 200) {
            return rpc.address;
          } 
        } catch (err) {
          console.error(err)
        }        
      }      
      return undefined;
    }
    return fn();
  }

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
    if (!await this.client) {
      this.setState(State.Error);
      this.setMessage("Client Not Exist!");
      return
    }
    await this.update();
  }

  get stargateClient(): Promise<SigningStargateClient | undefined> {
    const fn = async () => {
      const rpcEndpoint = await this.rpcEndpoint;
      console.info('Using RPC: ' + rpcEndpoint);
      if (this.offlineSigner && rpcEndpoint) {
        return SigningStargateClient.connectWithSigner(
          rpcEndpoint,
          this.offlineSigner,
          this.stargateOptions
      )}
      console.error('Undefined offlineSigner or rpcEndpoint.');
      return undefined; 
    }
    return fn();
  }

  get cosmwasmClient(): Promise<SigningCosmWasmClient | undefined> {
    const fn = async () => {
      const rpcEndpoint = await this.rpcEndpoint;
      console.info('Using RPC: ' + rpcEndpoint);
      if (this.offlineSigner && rpcEndpoint) {
        return SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          this.offlineSigner,
          this.stargateOptions
      )}
      console.error('Undefined offlineSigner or rpcEndpoint.');
      return undefined; 
    }
    return fn();
  };

  abstract get client(): Promise<A> | undefined | A;
}

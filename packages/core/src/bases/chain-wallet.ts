import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';

import { ChainInfo, ChainWalletDataBase, State } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  WalletClient,
  ChainWalletData extends ChainWalletDataBase,
  MainWallet
> extends StateBase<ChainWalletData> {
  protected _chainInfo: ChainInfo;
  protected mainWallet?: MainWallet;

  constructor(_chainInfo: ChainInfo, mainWallet?: MainWallet) {
    super();
    this._chainInfo = _chainInfo;
    this.mainWallet = mainWallet;
  }

  get chainInfo() {
    return this._chainInfo;
  }

  get chainName() {
    return this.chainInfo.name;
  }

  get stargateOptions(): SigningStargateClientOptions | undefined {
    return this.chainInfo.options?.stargate(this.chainRegistry);
  }

  get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined {
    return this.chainInfo.options?.cosmwasm(this.chainRegistry);
  }

  get chainRegistry() {
    return this.chainInfo.registry;
  }

  get chainId() {
    return this.chainRegistry?.chain_id;
  }

  get cosmwasmEnabled() {
    return this.chainRegistry?.codebase?.cosmwasm_enabled;
  }

  get rpcEndpoint(): Promise<string | undefined> {
    const fn = async () => {
      const rpcs = [
        { address: `https://rpc.cosmos.directory/${this.chainName}` }
      ];
      rpcs.push(...this.chainInfo.registry?.apis?.rpc);

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

  abstract get client(): Promise<WalletClient> | undefined | WalletClient;
}

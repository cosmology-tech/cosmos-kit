import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';

import { ChainRecord, ChainWalletDataBase, State } from '../types';
import { StateBase } from './state';

export abstract class ChainWalletBase<
  WalletClient,
  ChainWalletData extends ChainWalletDataBase,
  MainWallet
> extends StateBase<ChainWalletData> {
  protected _chainRecord: ChainRecord;
  protected mainWallet?: MainWallet;
  rpcEndpoints: string[];
  restEndpoints: string[];

  constructor(_chainRecord: ChainRecord, mainWallet?: MainWallet) {
    super();
    this._chainRecord = _chainRecord;
    this.mainWallet = mainWallet;
    this.rpcEndpoints = [
      ..._chainRecord.preferredEndpoints?.rpc || [],
      `https://rpc.cosmos.directory/${this.chainName}`, 
      ..._chainRecord.chain?.apis?.rpc.map(e => e.address) || []
    ];
    this.restEndpoints = [
      ..._chainRecord.preferredEndpoints?.rest || [],
      `https://rest.cosmos.directory/${this.chainName}`,
      ..._chainRecord.chain?.apis?.rest.map(e => e.address) || []
    ];
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
    for (const endpoint of this.rpcEndpoints) {   
      try {
        const response = await fetch(endpoint)
        if (response.status == 200) {
          return endpoint;
        } 
      } catch (err) {
        console.error(`Failed to fetch RPC ${endpoint}`)
      }        
    }      
    return undefined;
  }

  getRestEndpoint = async (): Promise<string | undefined> => {
    for (const endpoint of this.restEndpoints) { 
      try {
        const response = await fetch(endpoint);
        if (response.status == 200) {
          return endpoint;
        }
      } catch (err) {
        console.error(`Failed to fetch REST ${endpoint}`)
      }        
    }      
    return undefined;
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

  getStargateClient = async (): Promise<SigningStargateClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();
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

  getCosmWasmClient = async (): Promise<SigningCosmWasmClient | undefined> => {
    const rpcEndpoint = await this.getRpcEndpoint();
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

  abstract get client(): Promise<WalletClient> | undefined | WalletClient;
}

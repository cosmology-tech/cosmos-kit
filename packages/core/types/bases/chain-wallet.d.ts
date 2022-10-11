import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { ChainRecord, ChainWalletDataBase, Wallet } from '../types';
import { WalletBase } from './wallet';
export declare abstract class ChainWalletBase<Client, Data extends ChainWalletDataBase, MainWallet extends {
    walletInfo: Wallet;
    client: Client | undefined;
}> extends WalletBase<Client, Data> {
    protected _chainInfo: ChainRecord;
    protected _mainWallet: MainWallet;
    rpcEndpoints: string[];
    restEndpoints: string[];
    constructor(chainInfo: ChainRecord, mainWallet: MainWallet);
    get client(): Client;
    get walletInfo(): Wallet;
    get chainInfo(): ChainRecord;
    get chainName(): string;
    get stargateOptions(): SigningStargateClientOptions | undefined;
    get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined;
    get chain(): import("@chain-registry/types").Chain;
    get assets(): import("@chain-registry/types").Asset[];
    get assetList(): import("@chain-registry/types").AssetList;
    get chainId(): string;
    get cosmwasmEnabled(): boolean;
    getRpcEndpoint: () => Promise<string | undefined>;
    getRestEndpoint: () => Promise<string | undefined>;
    get address(): string | undefined;
    get offlineSigner(): OfflineSigner | undefined;
    getStargateClient: () => Promise<SigningStargateClient | undefined>;
    getCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>;
}

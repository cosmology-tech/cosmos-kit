import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainRecord, ChainWalletDataBase } from '../types';
import { StateBase } from './state';
export declare abstract class ChainWalletBase<WalletClient, ChainWalletData extends ChainWalletDataBase, MainWallet> extends StateBase<ChainWalletData> {
    protected _chainRecord: ChainRecord;
    protected mainWallet?: MainWallet;
    constructor(_chainRecord: ChainRecord, mainWallet?: MainWallet);
    get chainRecord(): ChainRecord;
    get chainName(): string;
    get stargateOptions(): SigningStargateClientOptions | undefined;
    get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined;
    get chain(): import("@chain-registry/types").Chain;
    get chainId(): string;
    get cosmwasmEnabled(): boolean;
    getRpcEndpoint: () => Promise<string | undefined>;
    get restEndpoint(): Promise<string | undefined>;
    get address(): string | undefined;
    get offlineSigner(): OfflineSigner | undefined;
    disconnect(): void;
    connect(): Promise<void>;
    getStargateClient: () => Promise<SigningStargateClient | undefined>;
    getCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>;
    abstract get client(): Promise<WalletClient> | undefined | WalletClient;
}

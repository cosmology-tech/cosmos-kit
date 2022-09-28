import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { ChainInfo, ChainWalletDataBase, Wallet } from '../types';
import { StateBase } from './state';
export declare abstract class ChainWalletBase<WalletClient, ChainWalletData extends ChainWalletDataBase, MainWallet extends {
    walletInfo: Wallet;
}> extends StateBase<ChainWalletData> {
    protected _chainInfo: ChainInfo;
    protected mainWallet: MainWallet;
    rpcEndpoints: string[];
    restEndpoints: string[];
    constructor(_chainInfo: ChainInfo, mainWallet: MainWallet);
    get walletInfo(): Wallet;
    get chainInfo(): ChainInfo;
    get chainName(): string;
    get stargateOptions(): SigningStargateClientOptions | undefined;
    get cosmwasmOptions(): SigningCosmWasmClientOptions | undefined;
    get chain(): import("@chain-registry/types").Chain;
    get chainId(): string;
    get cosmwasmEnabled(): boolean;
    getRpcEndpoint: () => Promise<string | undefined>;
    getRestEndpoint: () => Promise<string | undefined>;
    get address(): string | undefined;
    get offlineSigner(): OfflineSigner | undefined;
    disconnect(): void;
    connect(): Promise<void>;
    getStargateClient: () => Promise<SigningStargateClient | undefined>;
    getCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>;
    abstract get client(): Promise<WalletClient | undefined> | undefined | WalletClient;
}

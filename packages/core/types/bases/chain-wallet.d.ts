import { SigningCosmWasmClient, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClient, SigningStargateClientOptions } from '@cosmjs/stargate';
import { Callbacks, ChainRecord, ChainWalletDataBase, SessionOptions, Wallet } from '../types';
import { StateBase } from './state';
export declare abstract class ChainWalletBase<WalletClient, ChainWalletData extends ChainWalletDataBase, MainWallet extends {
    walletInfo: Wallet;
    client: Promise<WalletClient | undefined> | WalletClient | undefined;
}> extends StateBase<ChainWalletData> {
    protected _chainInfo: ChainRecord;
    protected mainWallet: MainWallet;
    protected _client: Promise<WalletClient | undefined> | WalletClient | undefined;
    rpcEndpoints: string[];
    restEndpoints: string[];
    constructor(_chainInfo: ChainRecord, mainWallet: MainWallet);
    get client(): WalletClient | Promise<WalletClient>;
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
    disconnect(callbacks?: Callbacks): void;
    connect(sessionOptions?: SessionOptions, callbacks?: Callbacks): Promise<void>;
    getStargateClient: () => Promise<SigningStargateClient | undefined>;
    getCosmWasmClient: () => Promise<SigningCosmWasmClient | undefined>;
}

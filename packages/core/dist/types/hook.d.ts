import { Chain, AssetList } from '@chain-registry/types';
import { OfflineAminoSigner, StdSignDoc, AminoSignResponse, StdSignature } from '@cosmjs/amino';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { EncodeObject, OfflineSigner, OfflineDirectSigner, DirectSignResponse } from '@cosmjs/proto-signing';
import { StargateClient, SigningStargateClient, StdFee, DeliverTxResponse } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { C as ChainWalletBase, o as Wallet, l as WalletStatus, E as ExtendedHttpEndpoint, H as NameService, A as AppUrl, w as SuggestToken, p as WalletAccount, q as SignOptions, r as DirectSignDoc, s as BroadcastMode, b as ChainRecord, M as MainWalletBase, N as NameServiceName, a as ChainName, c as SignerOptions, g as EndpointOptions, i as EventName, x as WalletClient } from '../chain-932d9904.js';
import { CosmosClientType, Mutable, ModalTheme, State } from './common.js';
import { WalletRepo } from '../repository.js';
import '@walletconnect/types';
import '../utils/logger.js';
import 'events';

interface ChainWalletContext {
    chainWallet: ChainWalletBase | undefined;
    chain: Chain;
    assets: AssetList | undefined;
    wallet: Wallet;
    logoUrl: string | undefined;
    address: string | undefined;
    username: string | undefined;
    message: string | undefined;
    status: WalletStatus;
    isWalletDisconnected: boolean;
    isWalletConnecting: boolean;
    isWalletConnected: boolean;
    isWalletRejected: boolean;
    isWalletNotExist: boolean;
    isWalletError: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    getRpcEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getRestEndpoint: (isLazy?: boolean) => Promise<string | ExtendedHttpEndpoint>;
    getStargateClient: () => Promise<StargateClient>;
    getCosmWasmClient: () => Promise<CosmWasmClient>;
    getSigningStargateClient: () => Promise<SigningStargateClient>;
    getSigningCosmWasmClient: () => Promise<SigningCosmWasmClient>;
    getNameService: () => Promise<NameService>;
    estimateFee: (messages: EncodeObject[], type?: CosmosClientType, memo?: string, multiplier?: number) => Promise<StdFee>;
    sign: (messages: EncodeObject[], fee?: StdFee, memo?: string, type?: CosmosClientType) => Promise<TxRaw>;
    broadcast: (signedMessages: TxRaw, type?: CosmosClientType) => Promise<DeliverTxResponse>;
    signAndBroadcast: (messages: EncodeObject[], fee?: StdFee, memo?: string, type?: CosmosClientType) => Promise<DeliverTxResponse>;
    qrUrl: Mutable<string> | undefined;
    appUrl: Mutable<AppUrl> | undefined;
    enable: () => Promise<void>;
    suggestToken: (data: SuggestToken) => Promise<void>;
    getAccount: () => Promise<WalletAccount>;
    getOfflineSigner: () => OfflineSigner;
    getOfflineSignerAmino: () => OfflineAminoSigner;
    getOfflineSignerDirect: () => OfflineDirectSigner;
    signAmino: (signer: string, signDoc: StdSignDoc, signOptions?: SignOptions) => Promise<AminoSignResponse>;
    signDirect: (signer: string, signDoc: DirectSignDoc, signOptions?: SignOptions) => Promise<DirectSignResponse>;
    signArbitrary: (signer: string, data: string | Uint8Array) => Promise<StdSignature>;
    sendTx(tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
interface ChainContext extends ChainWalletContext {
    wallet: Wallet | undefined;
    walletRepo: WalletRepo;
    openView: () => void;
    closeView: () => void;
}
interface ManagerContext {
    chainRecords: ChainRecord[];
    walletRepos: WalletRepo[];
    mainWallets: MainWalletBase[];
    defaultNameService: NameServiceName;
    getChainRecord: (chainName: ChainName) => ChainRecord;
    getWalletRepo: (chainName: ChainName) => WalletRepo;
    addChains: (chains: Chain[], assetLists: AssetList[], signerOptions?: SignerOptions, endpointOptions?: EndpointOptions) => void;
    getChainLogo: (chainName: ChainName) => string | undefined;
    getNameService: (chainName?: ChainName) => Promise<NameService>;
    on: (event: EventName, handler: (params: any) => void) => void;
    off: (event: EventName, handler: (params: any) => void) => void;
}
interface ModalThemeContext {
    modalTheme: ModalTheme;
    setModalTheme: (theme: ModalTheme) => void;
}
interface WalletContext {
    mainWallet: MainWalletBase | undefined;
    chainWallets: ChainWalletBase[];
    wallet: Wallet | undefined;
    status: WalletStatus;
    message: string | undefined;
}
interface WalletClientContext {
    client: WalletClient | undefined;
    status: State;
    message: string | undefined;
}

export { ChainContext, ChainWalletContext, ManagerContext, ModalThemeContext, WalletClientContext, WalletContext };

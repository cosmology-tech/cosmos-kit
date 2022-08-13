import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { ChainInfo } from '@keplr-wallet/types';
import { ConnectedWallet, Wallet } from '../types';
import { KeplrWallet } from './keplr';
import { KeplrWalletConnectWallet } from './keplr-walletconnect';
export { KeplrWallet, KeplrWalletConnectWallet };
export declare const AllWallets: Wallet[];
export declare const getConnectedWalletInfo: <Client = unknown>(wallet: Wallet<Client>, client: Client, chainInfo: ChainInfo, signingCosmWasmClientOptions?: SigningCosmWasmClientOptions, signingStargateClientOptions?: SigningStargateClientOptions) => Promise<ConnectedWallet>;

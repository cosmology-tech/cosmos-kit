import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { ConnectedWallet, Wallet } from '@cosmos-wallet/types';
import { ChainInfo } from '@keplr-wallet/types';
export declare const getConnectedWalletInfo: <Client = unknown>(wallet: Wallet<Client>, client: Client, chainInfo: ChainInfo, signingCosmWasmClientOptions?: SigningCosmWasmClientOptions, signingStargateClientOptions?: SigningStargateClientOptions) => Promise<ConnectedWallet>;

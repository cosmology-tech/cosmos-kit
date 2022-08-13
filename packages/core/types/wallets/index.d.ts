import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { KeplrWallet, KeplrWalletConnectWallet } from '@cosmos-wallet/keplr';
import { ConnectedWallet, Wallet } from '@cosmos-wallet/types';
import { ChainInfo } from '@keplr-wallet/types';
export { KeplrWallet, KeplrWalletConnectWallet };
export declare const AllWallets: Wallet[];
export declare const getConnectedWalletInfo: <Client = unknown>(wallet: Wallet<Client>, client: Client, chainInfo: ChainInfo, signingCosmWasmClientOptions?: SigningCosmWasmClientOptions, signingStargateClientOptions?: SigningStargateClientOptions) => Promise<ConnectedWallet>;

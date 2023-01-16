import { AssetList, Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { NameService } from '../name-service';

import { WalletRepo } from '../repository';
import { ChainName, ChainRecord } from './chain';
import { Dispatch, StateActions } from './common';
import { NameServiceName, WalletName } from './wallet';

export interface SignerOptions {
  stargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
  signingStargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
  signingCosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
}

export interface ViewOptions {
  alwaysOpenView?: boolean;
  closeViewWhenWalletIsConnected?: boolean;
  closeViewWhenWalletIsDisconnected?: boolean;
  closeViewWhenWalletIsRejected?: boolean;
}

export interface StorageOptions {
  disabled?: boolean;
  duration?: number; // ms
  clearOnTabClose?: boolean;
}

export interface SessionOptions {
  duration?: number; // ms
  killOnTabClose?: boolean;
}

export interface Endpoints {
  rpc?: string[];
  rest?: string[];
}

export type EndpointOptions = Record<ChainName, Endpoints>;

export interface WalletModalProps {
  isOpen: boolean;
  setOpen: Dispatch<boolean>;
  walletRepo?: WalletRepo;
  theme?: Record<string, any>;
}

export interface ManagerActions<T> extends StateActions<T> {
  walletName?: Dispatch<WalletName | undefined>;
  chainName?: Dispatch<ChainName | undefined>;
  viewOpen?: Dispatch<boolean>;
}

export interface ManagerContext {
  chainRecords: ChainRecord[];
  walletRepos: WalletRepo[];
  defaultNameService: NameServiceName;
  getChainRecord: (chainName: ChainName) => ChainRecord;
  getWalletRepo: (chainName: ChainName) => WalletRepo;
  addChains: (
    chains: Chain[],
    assetLists: AssetList[],
    signerOptions?: SignerOptions,
    endpointOptions?: EndpointOptions
  ) => void;
  getChainLogo: (chainName: ChainName) => string | undefined;
  getNameService: (chainName?: ChainName) => Promise<NameService>;
}

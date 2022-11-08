import { Chain } from '@chain-registry/types';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions } from '@cosmjs/stargate';

import { ChainName } from './chain';
import { Dispatch, StateActions } from './common';
import { WalletName } from './wallet';

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
}

export interface ManagerActions<T> extends StateActions<T> {
  walletName?: Dispatch<WalletName | undefined>;
  chainName?: Dispatch<ChainName | undefined>;
  viewOpen?: Dispatch<boolean>;
}

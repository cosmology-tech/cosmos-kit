import { Chain } from '@chain-registry/types';
import { IconType } from 'react-icons';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';

import { ChainWalletBase, MainWalletBase } from './bases';

export interface WalletData {
  [k: string]: any | undefined;
}
export interface ChainWalletData extends WalletData {
  address?: string;
  offlineSigner?: OfflineSigner;
}

export interface MainWalletData extends WalletData {
  username?: string;
}

export interface ExtendedMainWallet extends MainWalletBase<any, MainWalletData, any> {
  [k: string]: any | undefined;
}
export interface ExtendedChainWallet extends ChainWalletBase<any, ChainWalletData, any> {
  [k: string]: any | undefined;
}

export type ExtendedWallet = ExtendedMainWallet | ExtendedChainWallet;

export enum State {
  Init = 'Init',
  Pending = 'Pending',
  Done = 'Done',
  Error = 'Error',
}

export enum WalletStatus {
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  NotExist = "NotExist",
  Rejected = "Rejected",
  Error = "Error"
}

export interface Mutable<T> {
  state: State;
  data?: T;
  message?: string;
}

export type ChainName = string;
export type WalletName = string;

export type Dispatch<T> = (value: T) => void;

export interface Registry<Name> {
  name: Name;
  active: boolean;
}

interface Icon {
  browser?: string;
  os?: string;
  icon: IconType;
  link: string;
}

export interface WalletRegistry extends Registry<WalletName> {
  wallet: ExtendedMainWallet;
  prettyName: string;
  isQRCode: boolean;
  downloads?: {
    default: string;
    desktop?: Icon[];
    tablet?: Icon[];
    mobile?: Icon[];
  },
  logo?: string;
  qrCodeLink?: string;
}

export interface ChainRegistry extends Registry<ChainName> {
  raw?: Chain;
  options?: {
    stargate?: (chainInfo: Chain) => SigningStargateClientOptions | undefined;
    cosmwasm?: (chainInfo: Chain) => SigningCosmWasmClientOptions | undefined;
  }
}

// export interface ChainSelectorProps {
//     name: ChainName;
//     setName: Dispatch<ChainName>;
//     chainOptions: ChainOption[];
// }

export interface WalletModalProps {
  isOpen: boolean;
  setOpen: Dispatch<boolean>;
}

export interface Actions {
  [k: string]: Dispatch<any> | undefined;
}

export interface StateActions<T> extends Actions {
  state?: Dispatch<State>;
  data?: Dispatch<T | undefined>;
  message?: Dispatch<string | undefined>;
}

export interface ManagerActions<T> extends StateActions<T> {
  walletName?: Dispatch<WalletName | undefined>;
  chainName?: Dispatch<ChainName | undefined>,
  modalOpen?: Dispatch<boolean>;
}

export interface Autos {
  closeModalWhenWalletIsConnected?: boolean;
  closeModalWhenWalletIsDisconnected?: boolean;
  closeModalWhenWalletIsRejected?: boolean;
}
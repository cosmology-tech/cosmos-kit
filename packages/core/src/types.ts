import { Chain } from '@chain-registry/types';
import { IconType } from 'react-icons';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { SigningStargateClientOptions } from '@cosmjs/stargate';
import { SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';

import { ChainWalletBase, MainWalletBase } from './bases';

export interface ChainWalletDataBase {
  address?: string;
  offlineSigner?: OfflineSigner;
}

export interface MainWalletDataBase {
  username?: string;
}

export interface ChainWallet extends ChainWalletBase<unknown, ChainWalletDataBase, unknown> {
  [k: string]: any | undefined;
}
export interface MainWallet extends MainWalletBase<unknown, MainWalletDataBase, ChainWalletDataBase, ChainWallet> {
  [k: string]: any | undefined;
}

export type Wallet = ChainWallet | MainWallet;

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

export interface Info<Name> {
  name: Name;
  active: boolean;
}

interface Icon {
  browser?: string;
  os?: string;
  icon: IconType;
  link: string;
}

export interface WalletInfo extends Info<WalletName> {
  wallet: MainWallet;
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

export interface ChainInfo extends Info<ChainName> {
  registry?: Chain;
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
  [k: string]: Dispatch<unknown> | undefined;
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfflineSigner } from '@cosmjs/proto-signing';
import { IconType } from 'react-icons';

import { ChainWalletBase, MainWalletBase } from '../bases';

export type WalletName = string;

export enum WalletStatus {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting',
  Connected = 'Connected',
  NotExist = 'NotExist',
  Rejected = 'Rejected',
  Error = 'Error',
}

export interface DownloadInfo {
  browser?: string;
  os?: string;
  icon: IconType;
  link: string;
}

export interface Wallet {
  name: WalletName;
  prettyName: string;
  isQRCode: boolean;
  supportMobile: boolean;
  connectEventNames?: string[];
  downloads?: {
    default: string;
    desktop?: DownloadInfo[];
    tablet?: DownloadInfo[];
    mobile?: DownloadInfo[];
  };
  logo?: string;
  qrCodeLink?: string;
}

export interface ChainWalletDataBase {
  address?: string;
  offlineSigner?: OfflineSigner;
}

export interface MainWalletDataBase {
  username?: string;
}

export interface ChainWalletData extends ChainWalletDataBase {
  [k: string]: any | undefined;
}

export interface MainWalletData extends MainWalletDataBase {
  [k: string]: any | undefined;
}

export type WalletData = ChainWalletData | MainWalletData;

export interface ChainWallet extends ChainWalletBase<unknown, ChainWalletData> {
  [k: string]: any | undefined;
}

export interface WalletOption
  extends MainWalletBase<unknown, MainWalletData, ChainWallet> {
  [k: string]: any | undefined;
}

export type WalletAdapter = ChainWallet | WalletOption;

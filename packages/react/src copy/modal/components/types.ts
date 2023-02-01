/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlacementWithLogical } from '@chakra-ui/react';
import { MouseEventHandler, ReactNode, RefObject } from 'react';
import { IconType } from 'react-icons';

/* ================================== */
/*            default type            */
/* ================================== */
export interface DefaultLinkType extends DefaultLinkItemType {
  href?: string;
}

export enum Size {
  lg = 'lg',
  md = 'md',
  sm = 'sm',
}
export type IconTypeProps = string | IconType | JSX.Element | ReactNode | any;
export type DefaultLinkItemType = {
  text: string;
  icon?: IconTypeProps;
  size?: string;
};
export type DefaultCardType = {
  title: string;
  children: ReactNode;
};
export type DefaultIconButtonType = {
  label: string;
  showTooltip?: boolean;
  icon: IconTypeProps;
};

/* ================================== */
/*             wallet type            */
/* ================================== */

export type ConnectWalletCardType = {
  userInfo: ReactNode;
  addressBtn?: ReactNode;
  connectWalletButton?: ReactNode;
};

export type CopyAddressType = {
  address?: string;
  walletIcon?: string;
  isLoading?: boolean;
  maxDisplayLength?: number;
  isRound?: boolean;
  size?: string;
};
export type ConnectedShowAddressType = {
  username?: string;
  showLink?: boolean;
  isLoading?: boolean;
  address?: string;
};
export type ConnectedUserCardType = {
  walletIcon?: string;
  username?: string;
  icon?: ReactNode;
};
export type ConnectWalletType = {
  size?: string;
  buttonText?: string;
  variant?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: IconTypeProps;
  rightIcon?: IconTypeProps;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
};
export type ShowBalanceAssetsDetailsType = {
  name: string;
  imgSrc: string;
  ibc?: object;
  tag?: string;
  amount: string;
  value: string;
  depositLink: string;
  withdrawLink: string;
};
export type ShowBalanceAssetsTotalType = {
  total: string;
  availableAsset: string;
  bondedAssets: string;
  stakedAssets: string;
};
export enum LogoStatus {
  Loading = 'loading',
  Warning = 'warning',
  Error = 'error',
}
export type UserDeviceInfoType = {
  browser?: string;
  device: string;
  os?: string;
};
export type DeviceDataType = {
  browser?: string;
  os?: string;
  icon?: IconType;
  link: string;
};
export type DownloadLinkType = {
  desktop: DeviceDataType[];
  tablet: DeviceDataType[];
  mobile: DeviceDataType[];
  websiteDownload: string;
};
export type Downloads = {
  desktop: DownloadInfo[];
  tablet: DownloadInfo[];
  mobile: DownloadInfo[];
  default: string;
};
export type DownloadInfo = {
  browser?: string;
  os?: string;
  icon?: IconType;
  link: string;
};
export type WalletMode = 'extension' | 'wallet-connect';
export type Wallet = {
  name: string;
  prettyName?: string;
  logo?: string | IconType;
  mode: WalletMode;
  mobileDisabled: boolean;
  rejectMessage?: string;
  downloads?: Downloads;
  onClick?: () => void;
};
export type DisplayWalletListType = {
  initialFocus: RefObject<any>; // eslint-disable-line
  size?: string;
  walletsData: Wallet[];
};
export type DisplayModalControlButtonType = {
  size?: string;
  icon: IconTypeProps;
  handleClick?: () => void;
};
export type ButtonWithTipType = {
  size?: string;
  icon: IconType;
  header?: string;
  content?: string;
  placement?: PlacementWithLogical;
};
export type ConnectModalContentHeader = {
  size?: string;
  title: string;
  leftButton?: ReactNode;
  rightButton?: ReactNode;
};
export type ConnectModalContentType = {
  size?: string;
  logo?: string | IconType;
  status?: LogoStatus;
  username?: string;
  walletIcon?: string;
  contentHeader?: string;
  contentDesc?: string;
  addressButton?: ReactNode;
  bottomButton?: ReactNode;
  bottomLink?: ReactNode;
};
export type DownloadWalletButtonType = {
  icon?: IconType;
  text?: string;
  onClick?: () => void;
  disabled: boolean;
};
export type SimpleModalHeadType = {
  title: string;
  backButton: boolean;
  handleBack?: () => void;
  handleClose: () => void;
};
export type ConnectModalType = {
  initialRef: RefObject<any>;
  modalHead: ReactNode;
  modalContent: ReactNode;
  modalIsOpen: boolean;
  modalOnClose: () => void;
};

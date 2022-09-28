import React, { ReactNode, MouseEventHandler, RefObject } from "react";
import { IconType } from "react-icons";
import { OptionBase } from "chakra-react-select";
import { ColorMode, GridItemProps } from "@chakra-ui/react";

/* ================================== */
/*            default type            */
/* ================================== */
export enum WalletStatus {
  Init = "Init",
  Loading = "Loading",
  Loaded = "Loaded",
  NotExist = "NotExist",
  Rejected = "Rejected",
}
export type IconTypeProps = string | IconType | JSX.Element | ReactNode | any;
export type DefaultLinkItemType = {
  text: string;
  icon?: IconTypeProps;
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
/*             layout type            */
/* ================================== */
export type MainLayoutPropsType = {
  children: ReactNode | null;
  logo?: ReactNode;
  connectButton: ReactNode;
  selectChainDropdown: ReactNode | null;
  copyAddressButton?: ReactNode;
  connectedUserCard?: ReactNode;
  linkList: ReactNode;
};
export interface FloatingLayoutPropsType extends MainLayoutPropsType {
  bgImg: ReactNode | null;
}
export interface MenuPropsType extends MainLayoutPropsType {
  toggleColorMode: () => void;
}
export interface FloatingMenuPropsType extends FloatingLayoutPropsType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
}

/* ================================== */
/*             wallet type            */
/* ================================== */
export type ConnectedShowAddressType = {
  address?: string;
  isLoading?: boolean;
};
/* ---------------------------------- */
export type ConnectedUserCardType = {
  walletIcon?: string;
  username?: string;
  icon?: ReactNode;
};
/* ---------------------------------- */
export type ConnectWalletType = {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
};
/* ---------------------------------- */
export type ConnectWalletCardType = {
  userInfo: ReactNode;
  addressBtn?: ReactNode;
  connectWalletButton?: ReactNode;
};
/* ---------------------------------- */
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
/* ---------------------------------- */
export type DownloadWalletButtonType = {
  icon?: IconType;
  text?: string;
};
export type UserDeviceInfoType = {
  browser?: string;
  device?: string;
  os?: string;
};
export type DeviceDataType = {
  browser?: string;
  os?: string;
  icon?: IconType;
  link: string;
};
export type ExtensionLinkType = {
  desktop?: DeviceDataType[];
  tablet?: DeviceDataType[];
  mobile?: DeviceDataType[];
};
export type WalletRecordType = {
  id: string;
  logo?: string;
  walletName?: string;
  walletType: string;
  extensionLink?: ExtensionLinkType;
  websiteDownload?: string;
  qrCodeLink?: string;
};
export type DisplayWalletListType = {
  walletsData: WalletRecordType[];
  onClick: (select: WalletRecordType) => void;
};
export type ConnectModalContentType = {
  selectedWallet: WalletRecordType;
  stateHeader?: string;
  stateDesc?: string;
  downloadWalletButton?: ReactNode;
  connectWalletButton?: ReactNode;
  isLoading?: boolean;
  isReconnect?: boolean;
  isWarning?: boolean;
};
export type WalletModalType = {
  modalHead: ReactNode;
  modalContent: ReactNode;
  walletsData: WalletRecordType[];
  modalIsOpen: boolean;
  modalOnClose: () => void;
};

/* ================================== */
/*            staking type            */
/* ================================== */
export type DisplayChainsType = {
  chainName: string;
  imgSrc?: string;
  apr: string;
  address?: string;
  website: ReactNode;
  explorer: ReactNode;
  stakeLink: ReactNode;
  voteLink: ReactNode;
  dashboardLink: ReactNode;
};
export interface DefaultLinkType extends DefaultLinkItemType {
  href?: string;
}
export type TotalDataType = {
  title: string;
  content: string;
  claimLink?: ReactNode;
};
export type AssetsHeaderType = {
  title: string;
  chakraGridItemStyle?: GridItemProps;
};
export type Currency = {
  header?: string;
  fiatValue: string;
  appValue: string;
};
export type AssetsDataType = {
  chainName: string;
  imgSrc?: string;
  address: string;
  availableBalance?: Currency;
  stakedBalance?: Currency;
  claimableRewards?: Currency;
  apr: {
    header?: string;
    value: string;
  };
  website: ReactNode;
  explorer: ReactNode;
  stakeLink: ReactNode;
  voteLink: ReactNode;
  dashboardLink: ReactNode;
};

/* ================================== */
/*             chains type            */
/* ================================== */
export interface DataType extends OptionBase {
  isDisabled?: boolean;
  label: string;
  value: string;
  icon?: string;
  chainId: string;
  chainRoute?: string;
}

export type handleSelectChainDropdown = (value: DataType | null) => void;

export type ChangeChainDropdownType = {
  data: DataType[];
  selectedItem?: DataType;
  onChange: handleSelectChainDropdown;
  chainDropdownLoading?: boolean;
};

export type ChangeChainMenuType = {
  data: DataType[];
  value: DataType;
  onClose?: () => void;
  onChange: handleSelectChainDropdown;
  innerRef?: RefObject<HTMLInputElement>;
};

/* ================================== */
/*             market type            */
/* ================================== */
export type Avatar = {
  author: string;
  uploadTime?: string;
};
export type LearnCarsType = {
  title: string;
  subTitle?: string;
  description?: string;
  videoURL?: string;
  tags?: string[];
  displayAvatar?: boolean;
  avatar?: Avatar;
};
export type LogoCloudType = {
  logos?: IconTypeProps[];
};

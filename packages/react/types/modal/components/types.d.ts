import { PlacementWithLogical } from '@chakra-ui/react';
import { MouseEventHandler, ReactNode, RefObject } from 'react';
import { IconType } from 'react-icons';
export interface DefaultLinkType extends DefaultLinkItemType {
    href?: string;
}
export declare enum Size {
    lg = "lg",
    md = "md",
    sm = "sm"
}
export declare type IconTypeProps = string | IconType | JSX.Element | ReactNode | any;
export declare type DefaultLinkItemType = {
    text: string;
    icon?: IconTypeProps;
    size?: string;
};
export declare type DefaultCardType = {
    title: string;
    children: ReactNode;
};
export declare type DefaultIconButtonType = {
    label: string;
    showTooltip?: boolean;
    icon: IconTypeProps;
};
export declare type ConnectWalletCardType = {
    userInfo: ReactNode;
    addressBtn?: ReactNode;
    connectWalletButton?: ReactNode;
};
export declare type CopyAddressType = {
    address?: string;
    walletIcon?: string;
    isLoading?: boolean;
    maxDisplayLength?: number;
    isRound?: boolean;
    size?: string;
};
export declare type ConnectedShowAddressType = {
    username?: string;
    showLink?: boolean;
    isLoading?: boolean;
    address?: string;
};
export declare type ConnectedUserCardType = {
    walletIcon?: string;
    username?: string;
    icon?: ReactNode;
};
export declare type ConnectWalletType = {
    size?: string;
    buttonText?: string;
    variant?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    leftIcon?: IconTypeProps;
    rightIcon?: IconTypeProps;
    onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
};
export declare type ShowBalanceAssetsDetailsType = {
    name: string;
    imgSrc: string;
    ibc?: object;
    tag?: string;
    amount: string;
    value: string;
    depositLink: string;
    withdrawLink: string;
};
export declare type ShowBalanceAssetsTotalType = {
    total: string;
    availableAsset: string;
    bondedAssets: string;
    stakedAssets: string;
};
export declare enum LogoStatus {
    Loading = "loading",
    Warning = "warning",
    Error = "error"
}
export declare type UserDeviceInfoType = {
    browser?: string;
    device: string;
    os?: string;
};
export declare type DeviceDataType = {
    browser?: string;
    os?: string;
    icon?: IconType;
    link: string;
};
export declare type DownloadLinkType = {
    desktop: DeviceDataType[];
    tablet: DeviceDataType[];
    mobile: DeviceDataType[];
    websiteDownload: string;
};
export declare type Downloads = {
    desktop: DownloadInfo[];
    tablet: DownloadInfo[];
    mobile: DownloadInfo[];
    default: string;
};
export declare type DownloadInfo = {
    browser?: string;
    os?: string;
    icon?: IconType;
    link: string;
};
export declare type WalletMode = 'extension' | 'wallet-connect';
export declare type Wallet = {
    name: string;
    prettyName?: string;
    logo?: string | IconType;
    mode: WalletMode;
    mobileDisabled: boolean;
    rejectMessage?: string;
    downloads?: Downloads;
    onClick?: () => void;
};
export declare type DisplayWalletListType = {
    initialFocus: RefObject<any>;
    size?: string;
    walletsData: Wallet[];
};
export declare type DisplayModalControlButtonType = {
    size?: string;
    icon: IconTypeProps;
    handleClick?: () => void;
};
export declare type ButtonWithTipType = {
    size?: string;
    icon: IconType;
    header?: string;
    content?: string;
    placement?: PlacementWithLogical;
};
export declare type ConnectModalContentHeader = {
    size?: string;
    title: string;
    leftButton?: ReactNode;
    rightButton?: ReactNode;
};
export declare type ConnectModalContentType = {
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
export declare type DownloadWalletButtonType = {
    icon?: IconType;
    text?: string;
    onClick?: () => void;
    disabled: boolean;
};
export declare type SimpleModalHeadType = {
    title: string;
    backButton: boolean;
    handleBack?: () => void;
    handleClose: () => void;
};
export declare type ConnectModalType = {
    initialRef: RefObject<any>;
    modalHead: ReactNode;
    modalContent: ReactNode;
    modalIsOpen: boolean;
    modalOnClose: () => void;
};

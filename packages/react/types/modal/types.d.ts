import { ColorMode, GridItemProps } from '@chakra-ui/react';
import { OptionBase } from 'chakra-react-select';
import { MouseEventHandler, ReactNode, RefObject } from 'react';
import { IconType } from 'react-icons';
export declare enum WalletStatus {
    Init = "Init",
    Loading = "Loading",
    Loaded = "Loaded",
    NotExist = "NotExist",
    Rejected = "Rejected"
}
export declare type IconTypeProps = string | IconType | JSX.Element | ReactNode | any;
export declare type DefaultLinkItemType = {
    text: string;
    icon?: IconTypeProps;
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
export declare type MainLayoutPropsType = {
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
export declare type ConnectedShowAddressType = {
    address?: string;
    isLoading?: boolean;
};
export declare type ConnectedUserCardType = {
    walletIcon?: string;
    username?: string;
    icon?: ReactNode;
};
export declare type ConnectWalletType = {
    buttonText?: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    icon?: IconType;
    onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
};
export declare type ConnectWalletCardType = {
    userInfo: ReactNode;
    addressBtn?: ReactNode;
    connectWalletButton?: ReactNode;
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
export declare type DownloadWalletButtonType = {
    icon?: IconType;
    text?: string;
};
export declare type UserDeviceInfoType = {
    browser?: string;
    device?: string;
    os?: string;
};
export declare type DeviceDataType = {
    browser?: string;
    os?: string;
    icon?: IconType;
    link: string;
};
export declare type ExtensionLinkType = {
    desktop?: DeviceDataType[];
    tablet?: DeviceDataType[];
    mobile?: DeviceDataType[];
};
export declare type WalletRecordType = {
    id: string;
    logo?: string;
    walletName?: string;
    walletType: string;
    extensionLink?: ExtensionLinkType;
    websiteDownload?: string;
    qrCodeLink?: string;
};
export declare type DisplayWalletListType = {
    walletsData: WalletRecordType[];
    onClick: (select: WalletRecordType) => void;
};
export declare type ConnectModalContentType = {
    selectedWallet: WalletRecordType;
    stateHeader?: string;
    stateDesc?: string;
    downloadWalletButton?: ReactNode;
    connectWalletButton?: ReactNode;
    isLoading?: boolean;
    isReconnect?: boolean;
    isWarning?: boolean;
};
export declare type WalletModalType = {
    modalHead: ReactNode;
    modalContent: ReactNode;
    walletsData: WalletRecordType[];
    modalIsOpen: boolean;
    modalOnClose: () => void;
};
export declare type DisplayChainsType = {
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
export declare type TotalDataType = {
    title: string;
    content: string;
    claimLink?: ReactNode;
};
export declare type AssetsHeaderType = {
    title: string;
    chakraGridItemStyle?: GridItemProps;
};
export declare type Currency = {
    header?: string;
    fiatValue: string;
    appValue: string;
};
export declare type AssetsDataType = {
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
export interface DataType extends OptionBase {
    isDisabled?: boolean;
    label: string;
    value: string;
    icon?: string;
    chainId: string;
    chainRoute?: string;
}
export declare type handleSelectChainDropdown = (value: DataType | null) => void;
export declare type ChangeChainDropdownType = {
    data: DataType[];
    selectedItem?: DataType;
    onChange: handleSelectChainDropdown;
    chainDropdownLoading?: boolean;
};
export declare type ChangeChainMenuType = {
    data: DataType[];
    value: DataType;
    onClose?: () => void;
    onChange: handleSelectChainDropdown;
    innerRef?: RefObject<HTMLInputElement>;
};
export declare type Avatar = {
    author: string;
    uploadTime?: string;
};
export declare type LearnCarsType = {
    title: string;
    subTitle?: string;
    description?: string;
    videoURL?: string;
    tags?: string[];
    displayAvatar?: boolean;
    avatar?: Avatar;
};
export declare type LogoCloudType = {
    logos?: IconTypeProps[];
};

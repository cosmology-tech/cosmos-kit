import { MouseEventHandler, ReactNode, RefObject } from "react";
import { IconType } from "react-icons";

export interface ChainDivProps {
  prettyName: string;
  icon?: string;
}

export interface ConnectWalletType {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
}

export interface ChooseChainInfo {
  chainName: string;
  chainRoute?: string;
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}
export interface ConnectWalletType {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconType;
  onClickConnectBtn?: MouseEventHandler<HTMLButtonElement>;
}

export interface ConnectedUserdivType {
  username?: string;
  icon?: ReactNode;
}

export interface OptionBase {
  variant?: string;
  colorScheme?: string;
  isFixed?: boolean;
  isDisabled?: boolean;
}

export interface ChainOption extends OptionBase {
  isDisabled?: boolean;
  label: string;
  value: string;
  icon?: string;
  chainName: string;
  chainRoute?: string;
}

export type handleSelectChainDropdown = (value: ChainOption | null) => void;

export interface ChangeChainDropdownType {
  data: ChainOption[];
  selectedItem?: ChainOption;
  onChange: handleSelectChainDropdown;
  chainDropdownLoading?: boolean;
}

export interface ChangeChainMenuType {
  data: ChainOption[];
  value?: ChainOption;
  onClose?: () => void;
  onChange: handleSelectChainDropdown;
  innerRef?: RefObject<HTMLInputElement>;
}

export type CopyAddressType = {
  address?: string;
  walletIcon?: string;
  isLoading?: boolean;
  maxDisplayLength?: number;
  isRound?: boolean;
  size?: string;
};

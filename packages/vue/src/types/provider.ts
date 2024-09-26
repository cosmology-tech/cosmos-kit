import { WalletManager } from "@cosmos-kit/core";
import { Ref } from "vue";

import {
  ConnectModal,
  ThemeProvider,
  ThemeProviderProps,
} from "@interchain-ui/react";

export type ModalViewImpl = {
  head: React.ReactNode;
  content: React.ReactNode;
};

export type WalletManagerContext = {
  walletManager: WalletManager;
  isViewOpen: Ref<boolean>;
  modalProvided: boolean;
};

export type ModalCustomizationProps = {
  modalContainerClassName?: string;
  modalContentClassName?: string;
  modalChildrenClassName?: string;
  modalContentStyles?: React.CSSProperties;
};

export type ThemeCustomizationProps = ModalCustomizationProps &
  Pick<
    ThemeProviderProps,
    "defaultTheme" | "overrides" | "themeDefs" | "customTheme"
  >;

<!-- ChainProvider.vue -->
<template>
  <SelectedWalletRepoProvider>
    <WalletManagerProvider
      :chains="chains"
      :wallets="wallets"
      :assetLists="assetLists"
      :throwErrors="throwErrors"
      :subscribeConnectEvents="subscribeConnectEvents"
      :defaultNameService="defaultNameService"
      :walletConnectOptions="walletConnectOptions"
      :signerOptions="signerOptions"
      :endpointOptions="endpointOptions"
      :sessionOptions="sessionOptions"
      :logLevel="logLevel"
      :allowedIframeParentOrigins="allowedIframeParentOrigins"
      :walletModal="walletModal"
    >
      <slot />
    </WalletManagerProvider>
  </SelectedWalletRepoProvider>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect } from 'vue';
import { ThemeCustomizationProps } from './types';
import WalletManagerProvider from './context/WalletManagerProvider.vue';
import SelectedWalletRepoProvider from './context/SelectedWalletRepoProvider.vue';
import type { Chain, AssetList } from '@chain-registry/types';
import type {
  ChainName,
  MainWalletBase,
  LogLevel,
  WalletModalProps,
  WalletConnectOptions,
  NameServiceName,
  SignerOptions,
  EndpointOptions,
  SessionOptions,
  ModalOptions,
} from '@cosmos-kit/core';

import { Logger } from '@cosmos-kit/core';

const props = defineProps<{
  chains: (Chain | ChainName)[];
  assetLists?: AssetList[];
  wallets: MainWalletBase[];
  throwErrors?: boolean;
  subscribeConnectEvents?: boolean;
  defaultNameService?: NameServiceName;
  walletConnectOptions?: WalletConnectOptions;
  signerOptions?: SignerOptions;
  endpointOptions?: EndpointOptions;
  sessionOptions?: SessionOptions;
  logLevel?: LogLevel;
  allowedIframeParentOrigins?: string[];
  walletModal?: (props: WalletModalProps) => JSX.Element;
  modalViews?: any;
  modalTheme?: ThemeCustomizationProps;
  modalOptions?: ModalOptions;
}>();

const logger = ref(new Logger(props.logLevel || 'WARN'));

watchEffect(() => {
  if (props.walletModal) {
    logger.value.debug('Use custom wallet modal.');
  } else {
    logger.value.debug('You have forgot to use wallet modal.');
  }
});
</script>

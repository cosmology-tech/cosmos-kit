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
import { defineProps } from "vue";
import WalletManagerProvider from "./WalletManagerProvider.vue";
import SelectedWalletRepoProvider from "./SelectedWalletRepoProvider.vue";
import type { Chain, AssetList } from "@chain-registry/types";
import {
  ChainName,
  LogLevel,
  MainWalletBase,
  WalletModalProps,
} from "@cosmos-kit/core";

const props = defineProps<{
  chains: (Chain | ChainName)[];
  assetLists?: AssetList[];
  wallets: MainWalletBase[];
  throwErrors?: boolean;
  subscribeConnectEvents?: boolean;
  defaultNameService?: string;
  walletConnectOptions?: any;
  signerOptions?: any;
  endpointOptions?: any;
  sessionOptions?: any;
  logLevel?: LogLevel;
  allowedIframeParentOrigins?: string[];
  walletModal?: (props: WalletModalProps) => JSX.Element;
}>();
</script>

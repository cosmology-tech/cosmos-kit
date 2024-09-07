<template>
  <slot />
  <component
    v-if="ProvidedWalletModal"
    :is="ProvidedWalletModal"
    :isOpen="isViewOpen"
    :setOpen="setViewOpen"
    :walletRepo="viewWalletRepo"
  />
</template>

<script setup lang="ts">
import { ref, provide, defineProps, onMounted, onUnmounted } from "vue";
import { Logger, WalletManager, State, WalletRepo } from "@cosmos-kit/core";
import type { AssetList, Chain } from "@chain-registry/types";
import type {
  ChainName,
  MainWalletBase,
  LogLevel,
  WalletModalProps,
} from "@cosmos-kit/core";

const walletManagerKey = "walletManager";

const props = defineProps<{
  chains: (Chain | ChainName)[];
  wallets: MainWalletBase[];
  assetLists?: AssetList[];
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

const logger = new Logger(props.logLevel || "WARN");
const walletManager = new WalletManager(
  props.chains,
  props.wallets,
  logger,
  props.throwErrors || false,
  props.subscribeConnectEvents || true,
  props.allowedIframeParentOrigins || [],
  props.assetLists,
  props.defaultNameService,
  props.walletConnectOptions,
  props.signerOptions,
  props.endpointOptions,
  props.sessionOptions
);

const isViewOpen = ref(false);
const viewWalletRepo = ref<WalletRepo | undefined>();
const data = ref<any>();
const state = ref<State>(State.Init);
const msg = ref<string | undefined>();
const ProvidedWalletModal = props.walletModal;

const setViewOpen = (value: boolean) => {
  isViewOpen.value = value;
};

walletManager.setActions({
  viewOpen: setViewOpen,
  viewWalletRepo: (repo) => (viewWalletRepo.value = repo),
  data: (newData) => (data.value = newData),
  state: (newState) => (state.value = newState),
  message: (message) => (msg.value = message),
});

walletManager.walletRepos.forEach((wr) => {
  wr.setActions({
    viewOpen: setViewOpen,
    viewWalletRepo: (repo) => (viewWalletRepo.value = repo),
  });
  wr.wallets.forEach((w) => {
    w.setActions({
      data: (newData) => (data.value = newData),
      state: (newState) => (state.value = newState),
      message: (message) => (msg.value = message),
    });
  });
});

walletManager.mainWallets.forEach((w) => {
  w.setActions({
    data: (newData) => (data.value = newData),
    state: (newState) => (state.value = newState),
    message: (message) => (msg.value = message),
  });
});

onMounted(() => {
  walletManager.onMounted();
});

onUnmounted(() => {
  walletManager.onUnmounted();
  setViewOpen(false);
});

provide(walletManagerKey, walletManager);
</script>

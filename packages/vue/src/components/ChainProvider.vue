<!-- ChainProvider.vue -->
<template>
  <div>
    <component
      :is="walletModalComponent"
      :isOpen="isViewOpen"
      :setOpen="setViewOpen"
      :walletRepo="viewWalletRepo"
    />
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, onUnmounted, defineProps } from "vue";
import { WalletManager, Logger, State } from "@cosmos-kit/core";

const props = defineProps({
  chains: Array,
  assetLists: Array,
  wallets: Array,
  walletModal: Function,
  throwErrors: Boolean,
  subscribeConnectEvents: Boolean,
  defaultNameService: String,
  walletConnectOptions: Object,
  signerOptions: Object,
  endpointOptions: Object,
  sessionOptions: Object,
  logLevel: String,
  allowedIframeParentOrigins: Array,
});

const isViewOpen = ref(false);
const viewWalletRepo = ref(undefined);
const data = ref(undefined);
const state = ref(State.Init);
const msg = ref(undefined);
const render = ref(0);

const logger = new Logger(props.logLevel);
const walletManager = new WalletManager(
  props.chains,
  props.wallets,
  logger,
  props.throwErrors,
  props.subscribeConnectEvents,
  props.allowedIframeParentOrigins,
  props.assetLists,
  props.defaultNameService,
  props.walletConnectOptions,
  props.signerOptions,
  props.endpointOptions,
  props.sessionOptions
);

provide("walletContext", {
  walletManager,
  modalProvided: Boolean(props.walletModal),
});

walletManager.setActions({
  viewOpen: (value) => {
    isViewOpen.value = value;
  },
  viewWalletRepo: (repo) => {
    viewWalletRepo.value = repo;
  },
  data: (data) => {
    data.value = data;
  },
  state: (state) => {
    state.value = state;
  },
  message: (msg) => {
    msg.value = msg;
  },
});

walletManager.walletRepos.forEach((wr) => {
  wr.setActions({
    viewOpen: (value) => {
      isViewOpen.value = value;
    },
    viewWalletRepo: (repo) => {
      viewWalletRepo.value = repo;
    },
    render: () => {
      render.value += 1;
    },
  });
  wr.wallets.forEach((w) => {
    w.setActions({
      data: (data) => {
        data.value = data;
      },
      state: (state) => {
        state.value = state;
      },
      message: (msg) => {
        msg.value = msg;
      },
    });
  });
});

walletManager.mainWallets.forEach((w) => {
  w.setActions({
    data: (data) => {
      data.value = data;
    },
    state: (state) => {
      state.value = state;
    },
    message: (msg) => {
      msg.value = msg;
    },
    clientState: (state) => {
      /* handle clientState */
    },
    clientMessage: (msg) => {
      /* handle clientMessage */
    },
  });
});

onMounted(() => {
  walletManager.onMounted();
});

onUnmounted(() => {
  isViewOpen.value = false;
  walletManager.onUnmounted();
});
</script>

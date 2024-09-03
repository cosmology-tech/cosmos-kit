import {
  ref,
  computed,
  inject,
  nextTick,
  watch,
  onMounted,
  watchEffect,
  onUpdated,
} from "vue";
import { ChainContext, ChainName, DisconnectOptions } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils";

const walletContextKey = "walletManager";

export const useChain = (chainName: ChainName, sync = true): ChainContext => {
  const context = inject(walletContextKey);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const walletManager: any = context;
  const walletRepo = walletManager?.getWalletRepo(chainName);
  walletRepo.activate();

  const {
    connect,
    disconnect,
    openView,
    closeView,
    current,
    chainRecord: { chain, assetList },
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  } = walletRepo;

  const chainWalletContext = ref(null);

  watchEffect((onCleanup) => {
    const timeoutId = setTimeout(() => {
      chainWalletContext.value = chain
        ? getChainWalletContext(chain.chain_id, walletRepo.current, sync)
        : undefined;

      console.log("chainWalletContext", chainWalletContext.value);
    }, 600);

    onCleanup(() => {
      clearTimeout(timeoutId);
    });
  });

  watch(
    [() => chain, () => assetList],
    () => {
      const currentWallet = window.localStorage.getItem(
        "cosmos-kit@2:core//current-wallet"
      );
      if (
        sync &&
        chainWalletContext.value &&
        chainWalletContext.value.isWalletDisconnected &&
        currentWallet
      ) {
        connect(currentWallet);
      }
    },
    { immediate: true } // immediate: true ensures the watch function runs initially
  );

  return {
    ...chainWalletContext.value,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(void 0, sync),
    disconnect: (options?: DisconnectOptions) =>
      walletRepo.disconnect(void 0, sync, options),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  };
};

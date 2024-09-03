import { ref, reactive, inject, watch, onMounted, onUnmounted } from "vue";
import { ChainContext, ChainName, DisconnectOptions } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils";

const walletContextKey = "walletManager";

export const useChain = (chainName: ChainName, sync = true) => {
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

  // create a reactive object
  const state = reactive<ChainContext>({
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
    address: undefined,
    status: undefined,
    isWalletConnected: undefined,
    isWalletDisconnected: undefined,
  } as ChainContext);

  watch(
    [() => chain, () => assetList],
    () => {
      const currentWallet = window.localStorage.getItem(
        "cosmos-kit@2:core//current-wallet"
      );
      if (sync && currentWallet) {
        connect(currentWallet);
      }
    },
    { immediate: true }
  );

  onMounted(() => {
    const timeoutId = setTimeout(() => {
      const chainWalletContext = chain
        ? getChainWalletContext(chain.chain_id, walletRepo.current, sync)
        : undefined;

      Object.assign(state, chainWalletContext);

      console.log("Updated state", state);
    }, 600);

    onUnmounted(() => {
      clearTimeout(timeoutId);
    });
  });

  return state;
};

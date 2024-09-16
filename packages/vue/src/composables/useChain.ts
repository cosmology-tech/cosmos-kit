import {
  ref,
  reactive,
  Reactive,
  inject,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import { ChainContext, ChainName, DisconnectOptions } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils";
import { WalletManagerContext } from "../types";

const walletContextKey = "walletManager";

export const useChain = (
  chainName: ChainName,
  sync = true
): Reactive<ChainContext> => {
  const context = inject<WalletManagerContext>(walletContextKey);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const { walletManager, isViewOpen } = context;
  let walletRepo = walletManager.getWalletRepo(chainName);
  walletRepo.activate();

  const state = reactive<ChainContext>({
    walletRepo,
    chain: walletRepo.chainRecord.chain,
    assets: walletRepo.chainRecord.assetList,
    openView: walletRepo.openView,
    closeView: walletRepo.closeView,
    connect: () => walletRepo.connect(void 0, sync),
    disconnect: (options?: DisconnectOptions) =>
      walletRepo.disconnect(void 0, sync, options),
    getRpcEndpoint: walletRepo.getRpcEndpoint,
    getRestEndpoint: walletRepo.getRestEndpoint,
    getStargateClient: walletRepo.getStargateClient,
    getCosmWasmClient: walletRepo.getCosmWasmClient,
    getNameService: walletRepo.getNameService,
  } as ChainContext);

  const getWalletContext = async () => {
    const chainWalletContext = walletRepo.chainRecord.chain
      ? getChainWalletContext(
          walletRepo.chainRecord.chain.chain_id,
          walletRepo.current,
          sync
        )
      : undefined;

    console.log("WalletManager changed:", chainWalletContext);
    Object.assign(state, chainWalletContext);
  };

  watch(
    [() => state.chain, () => state.assets],
    () => {
      const currentWallet = window.localStorage.getItem(
        "cosmos-kit@2:core//current-wallet"
      );
      if (sync && currentWallet) {
        walletRepo.connect(currentWallet);
      }
    },
    { immediate: true }
  );

  watch(
    () => isViewOpen,
    () => {
      getWalletContext();
    },
    { deep: true }
  );

  onMounted(() => {
    const timeoutId = setTimeout(() => {
      getWalletContext();
    }, 600);
    onUnmounted(() => {
      clearTimeout(timeoutId);
    });
  });

  return state;
};

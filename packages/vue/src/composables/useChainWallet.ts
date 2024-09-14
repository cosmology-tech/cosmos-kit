import { inject, computed, onMounted, onUnmounted, reactive, watch } from "vue";
import { ChainName, ChainWalletContext, WalletName } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils";

const walletContextKey = "walletManager";

export const useChainWallet = (
  chainName: ChainName,
  walletName: WalletName,
  sync = true
) => {
  const context = inject(walletContextKey);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const { walletManager, isViewOpen }: any = context;

  const wallet = walletManager.getChainWallet(chainName, walletName);
  wallet.activate();

  // const chainWalletContext = computed<ChainWalletContext | undefined>(() => {
  //   if (wallet.chain) {
  //     return getChainWalletContext(wallet.chain.chain_id, wallet, sync);
  //   } else {
  //     return void 0;
  //   }
  // });

  const state = reactive<ChainWalletContext | Record<string, any>>({});

  const getWalletContext = async () => {
    const chainWalletContext = wallet.chain
      ? getChainWalletContext(wallet.chain.chain_id, wallet, sync)
      : undefined;

    Object.assign(state, chainWalletContext);
  };

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

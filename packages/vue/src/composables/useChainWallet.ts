import { inject, computed, onMounted, onUnmounted, reactive } from "vue";
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

  const walletManager: any = context;

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

  onMounted(() => {
    const timeoutId = setTimeout(() => {
      const chainWalletContext = wallet.chain
        ? getChainWalletContext(wallet.chain.chain_id, wallet, sync)
        : undefined;

      Object.assign(state, chainWalletContext);

      // console.log("Updated state", state);
    }, 500);

    onUnmounted(() => {
      clearTimeout(timeoutId);
    });
  });

  return state;
};

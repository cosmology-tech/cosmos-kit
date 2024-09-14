import { State, WalletClientContext, WalletName } from "@cosmos-kit/core";
import { inject, onMounted, onUnmounted, reactive, Reactive } from "vue";

const walletContextKey = "walletManager";

export const useWalletClient = (
  walletName?: WalletName
): Reactive<WalletClientContext> => {
  const context = inject(walletContextKey);

  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
  }

  const { walletManager }: any = context;
  const state = reactive<WalletClientContext>({
    client: void 0,
    status: State.Init,
    message: void 0,
  });

  const updateWalletState = () => {
    const mainWallet = walletName
      ? walletManager.getMainWallet(walletName)
      : walletManager.mainWallets.find((w) => w.isActive);

    if (!mainWallet) {
      state.client = undefined;
      (state.status = State.Init), (state.message = undefined);
      return;
    }

    const { clientMutable } = mainWallet;

    state.client = clientMutable.data;
    state.status = clientMutable.state;

    state.message = clientMutable.message;
  };

  onMounted(() => {
    const timeoutId = setTimeout(() => {
      updateWalletState();
    }, 600);

    onUnmounted(() => {
      clearTimeout(timeoutId);
    });
  });

  return state;
};

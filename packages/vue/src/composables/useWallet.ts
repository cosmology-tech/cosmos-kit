import {
  ref,
  reactive,
  inject,
  watch,
  Reactive,
  onMounted,
  onUnmounted,
} from "vue";
import {
  WalletContext,
  WalletName,
  WalletStatus,
  State,
} from "@cosmos-kit/core";

const walletContextKey = "walletManager";

export const useWallet = (
  walletName?: WalletName,
  activeOnly = true
): Reactive<WalletContext> => {
  const context = inject(walletContextKey);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const walletManager: any = context;
  const state = reactive<WalletContext>({
    mainWallet: null,
    chainWallets: [],
    wallet: undefined,
    status: WalletStatus.Disconnected,
    message: undefined,
  });

  const updateWalletState = () => {
    const mainWallet = walletName
      ? walletManager.getMainWallet(walletName)
      : walletManager.mainWallets.find(
          (w) => w.isActive && w.clientMutable.state !== State.Error
        );

    if (!mainWallet) {
      state.mainWallet = null;
      state.chainWallets = [];
      state.wallet = undefined;
      state.status = WalletStatus.Disconnected;
      state.message = undefined;
      return;
    }

    const { walletInfo, getChainWalletList, getGlobalStatusAndMessage } =
      mainWallet;
    const [globalStatus, globalMessage] = getGlobalStatusAndMessage(activeOnly);

    state.mainWallet = mainWallet;
    state.chainWallets = getChainWalletList(false);
    state.wallet = walletInfo;
    state.status = globalStatus;
    state.message = globalMessage;
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

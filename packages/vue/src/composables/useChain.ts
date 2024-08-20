// useChain.js
import { inject, ref, watch, onMounted } from "vue";
import { ChainContext, ChainName, DisconnectOptions } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils/getChainWalletContext";

export function useChain(chainName, sync = true) {
  const context = inject("walletContext");
  const forceRender = ref(0);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const { walletManager, modalProvided } = context;

  if (!modalProvided) {
    throw new Error(
      "You have to provide `walletModal` to use `useChain`, or use `useChainWallet` instead."
    );
  }

  const walletRepo = walletManager.getWalletRepo(chainName);
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

  const chainWalletContext = ref(
    chain ? getChainWalletContext(chain.chain_id, current, sync) : undefined
  );

  watch(
    [() => chain, () => assetList, () => chainWalletContext.value?.address],
    () => {
      forceRender.value += 1;
    }
  );

  onMounted(() => {
    const currentWallet = window.localStorage.getItem(
      "cosmos-kit@2:core//current-wallet"
    );
    if (
      sync &&
      chainWalletContext.value?.isWalletDisconnected &&
      currentWallet
    ) {
      connect(currentWallet);
    }
  });

  return {
    ...chainWalletContext.value,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(undefined, sync),
    disconnect: (options) => disconnect(undefined, sync, options),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService,
  };
}

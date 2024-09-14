import { reactive, inject } from "vue";
import { ChainContext, ChainName } from "@cosmos-kit/core";
import { getChainWalletContext } from "../utils";

const walletContextKey = "walletManager";

export function useChains(chainNames: ChainName[], sync = true) {
  const context = inject(walletContextKey);

  if (!context) {
    throw new Error("You have forgotten to use ChainProvider.");
  }

  const { walletManager, isViewOpen }: any = context;

  const names = Array.from(new Set(chainNames));
  const repos = names.map((name) => walletManager?.getWalletRepo(name));
  const ids = repos.map((repo) => repo.chainRecord.chain.chain_id);

  const state = reactive<Record<ChainName, ChainContext>>({});

  repos.forEach((walletRepo, index) => {
    const chainName = names[index];
    walletRepo.activate();

    walletRepo.wallets.forEach((wallet) => {
      if (wallet.isModeExtension) {
        wallet.callbacks.beforeConnect = async () => {
          try {
            await wallet.client?.enable?.(ids);
          } catch (e) {
            for (const repo of repos) {
              await wallet.client?.addChain?.(repo.chainRecord);
            }
            await wallet.client?.enable?.(ids);
          }
        };
      }

      if (wallet.isModeWalletConnect) {
        wallet.connectChains = async () => {
          await wallet?.client?.connect?.(ids);
          for (const name of names.filter((name) => name !== chainName)) {
            await wallet.mainWallet
              .getChainWallet(name)
              .update({ connect: false });
          }
        };
      }
    });

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

    state[chainName] = {
      walletRepo,
      chain,
      assets: assetList,
      openView,
      closeView,
      connect: () =>
        connect(
          localStorage.getItem("cosmos-kit@2:core//current-wallet"),
          sync
        ),
      disconnect: () => disconnect(void 0, sync),
      getRpcEndpoint,
      getRestEndpoint,
      getStargateClient,
      getCosmWasmClient,
      getNameService,
    } as ChainContext;

    setTimeout(() => {
      const chainWalletContext = getChainWalletContext(
        chain.chain_id,
        walletRepo.current,
        sync
      );

      Object.assign(state[chainName], chainWalletContext);

      console.log(`Updated state for chain ${chainName}`, state[chainName]);
    }, 600);
  });

  return state;
}

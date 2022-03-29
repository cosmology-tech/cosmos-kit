import { IndexedDBKVStore } from "@keplr-wallet/common";
import {
  AccountStore,
  AccountWithCosmos,
  ChainStore,
  QueriesStore,
  QueriesWithCosmosAndSecretAndCosmwasm,
} from "@keplr-wallet/stores";
import { ChainInfo, Keplr } from "@keplr-wallet/types";
import EventEmitter from "eventemitter3";
import { EmbedChainInfos } from "../config";
import { KeplrWalletConnectV1 } from "../providers/wc-client";

export class RootStore {
  public readonly chainStore: ChainStore<ChainInfo>;
  public readonly accountStore: AccountStore<AccountWithCosmos>;
  public readonly queriesStore: QueriesStore<QueriesWithCosmosAndSecretAndCosmwasm>;

  constructor(getKeplr: () => Promise<Keplr | undefined>) {
    this.chainStore = new ChainStore<ChainInfo>(EmbedChainInfos);

    const eventListener = (() => {
      // On client-side (web browser), use the global window object.
      if (typeof window !== "undefined") {
        return window;
      }

      // On server-side (nodejs), there is no global window object.
      // Alternatively, use the event emitter library.
      const emitter = new EventEmitter();
      return {
        addEventListener: (type: string, fn: () => unknown) => {
          emitter.addListener(type, fn);
        },
        removeEventListener: (type: string, fn: () => unknown) => {
          emitter.removeListener(type, fn);
        },
      };
    })();

    this.queriesStore = new QueriesStore<QueriesWithCosmosAndSecretAndCosmwasm>(
      new IndexedDBKVStore("store_web_queries"),
      this.chainStore,
      getKeplr,
      QueriesWithCosmosAndSecretAndCosmwasm
    );

    this.accountStore = new AccountStore<AccountWithCosmos>(
      eventListener,
      AccountWithCosmos,
      this.chainStore,
      this.queriesStore,
      {
        defaultOpts: {
          prefetching: false,
          suggestChain: true,
          autoInit: false,
          getKeplr,
          suggestChainFn: async (keplr, chainInfo) => {
            if (keplr.mode === "mobile-web") {
              // Can't suggest the chain on mobile web.
              return;
            }

            if (keplr instanceof KeplrWalletConnectV1) {
              // Can't suggest the chain using wallet connect.
              return;
            }

            await keplr.experimentalSuggestChain(chainInfo.raw);
          },
        },
      }
    );
  }
}

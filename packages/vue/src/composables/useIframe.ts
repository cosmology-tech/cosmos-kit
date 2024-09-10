import { ref, watch, onMounted, onUnmounted, Ref } from "vue";
import { OfflineAminoSigner } from "@cosmjs/amino";
import { OfflineDirectSigner } from "@cosmjs/proto-signing";
import {
  COSMIFRAME_KEYSTORECHANGE_EVENT,
  COSMIFRAME_NOT_CONNECTED_MESSAGE,
  MainWalletBase,
  WalletClient,
  WalletName,
} from "@cosmos-kit/core";
import {
  Cosmiframe,
  OverrideHandler,
  ParentMetadata,
} from "@dao-dao/cosmiframe";
import { useWallet } from "./useWallet";

export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

export type UseIframeOptions = {
  walletName?: WalletName;
  metadata?: ParentMetadata;
  walletClientOverrides?: Partial<{
    [K in FunctionKeys<WalletClient>]: (
      ...params: Parameters<WalletClient[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
  signerOverrides?: Partial<{
    [K in keyof (OfflineAminoSigner & OfflineDirectSigner)]: (
      ...params: Parameters<(OfflineAminoSigner & OfflineDirectSigner)[K]>
    ) => OverrideHandler | Promise<OverrideHandler>;
  }>;
  origins?: string[];
};

export const useIframe = ({
  walletName,
  metadata,
  walletClientOverrides,
  signerOverrides,
  origins,
}: UseIframeOptions = {}): {
  wallet: MainWalletBase;
  iframeRef: Ref<HTMLIFrameElement | null>;
} => {
  const walletContext = useWallet(walletName);
  const iframeRef = ref<HTMLIFrameElement | null>(null);

  // 保存 walletClientOverrides 和 signerOverrides 的 ref
  const walletClientOverridesRef = ref(walletClientOverrides);
  const signerOverridesRef = ref(signerOverrides);

  const notifyIframe = () => {
    iframeRef.value?.contentWindow?.postMessage(
      { event: COSMIFRAME_KEYSTORECHANGE_EVENT },
      "*"
    );
  };

  // 添加事件监听
  const addEventListeners = () => {
    if (!walletContext.mainWallet || typeof window === "undefined") return;

    notifyIframe();

    walletContext.mainWallet.walletInfo.connectEventNamesOnWindow?.forEach(
      (eventName) => {
        window.addEventListener(eventName, notifyIframe);
      }
    );

    walletContext.mainWallet.walletInfo.connectEventNamesOnClient?.forEach(
      async (eventName) => {
        walletContext.mainWallet.client?.on?.(eventName, notifyIframe);
      }
    );
  };

  // 移除事件监听
  const removeEventListeners = () => {
    walletContext?.mainWallet?.walletInfo.connectEventNamesOnWindow?.forEach(
      (eventName) => {
        window.removeEventListener(eventName, notifyIframe);
      }
    );

    walletContext.mainWallet.walletInfo.connectEventNamesOnClient?.forEach(
      async (eventName) => {
        walletContext?.mainWallet.client?.off?.(eventName, notifyIframe);
      }
    );
  };

  // 监听 mainWallet 和 iframeRef 的变化
  watch(
    [() => walletContext.mainWallet, iframeRef],
    ([newMainWallet, newIframe]) => {
      if (newMainWallet && newIframe) {
        notifyIframe();
        addEventListeners();
      }
    }
  );

  // 在组件挂载时添加 Cosmiframe 监听
  onMounted(() => {
    if (!iframeRef.value) return;

    const removeListener = Cosmiframe.listen({
      iframe: iframeRef.value,
      target: walletContext.mainWallet?.client || {},
      getOfflineSignerDirect:
        walletContext.mainWallet?.client.getOfflineSignerDirect.bind(
          walletContext.mainWallet?.client
        ) || (() => Promise.reject(COSMIFRAME_NOT_CONNECTED_MESSAGE)),
      getOfflineSignerAmino:
        walletContext.mainWallet?.client.getOfflineSignerAmino.bind(
          walletContext.mainWallet.client
        ) || (() => Promise.reject(COSMIFRAME_NOT_CONNECTED_MESSAGE)),
      nonSignerOverrides: () => ({
        ...walletClientOverridesRef.value,
        connect: async (...params) => {
          if (walletClientOverridesRef.value?.connect) {
            return await walletClientOverridesRef.value.connect(
              params[0],
              params[1]
            );
          } else if (walletContext.mainWallet?.client?.connect) {
            await walletContext.mainWallet.client.connect(params[0], params[1]);
          } else {
            return {
              type: "error",
              error: COSMIFRAME_NOT_CONNECTED_MESSAGE,
            };
          }
        },
      }),
      signerOverrides: () => signerOverridesRef.value,
      origins,
      metadata: {
        name:
          metadata?.name ||
          `${walletContext.mainWallet?.walletInfo.prettyName} (Outer Wallet)`,
        imageUrl:
          metadata?.imageUrl ||
          (walletContext.mainWallet?.walletInfo.logo
            ? typeof walletContext.mainWallet?.walletInfo.logo === "string"
              ? walletContext.mainWallet?.walletInfo.logo
              : "major" in walletContext.mainWallet?.walletInfo.logo
              ? walletContext.mainWallet?.walletInfo.logo.major
              : undefined
            : undefined),
      },
    });

    // 在组件销毁时移除 Cosmiframe 监听
    onUnmounted(() => {
      removeListener();
      removeEventListeners();
    });
  });

  return {
    wallet: walletContext.mainWallet as MainWalletBase,
    iframeRef,
  };
};

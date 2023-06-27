// src/hooks/useChain.ts
import React2 from "react";

// src/provider.tsx
import {
  Logger,
  State,
  WalletManager
} from "@cosmos-kit/core";
import {
  createContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var walletContext = createContext(null);

// src/utils.ts
import {
  WalletStatus
} from "@cosmos-kit/core";
function getChainWalletContext(chainId, wallet, sync = true) {
  function walletAssert(func, params = [], name) {
    if (!wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }
    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${wallet?.walletInfo.prettyName} yet.`
      );
    }
    return func(...params);
  }
  function clientMethodAssert(func, params = [], name) {
    if (!wallet) {
      throw new Error(
        `Wallet is undefined. Please choose a wallet to connect first.`
      );
    }
    if (!wallet?.client) {
      throw new Error(`Wallet Client is undefined.`);
    }
    if (!func) {
      throw new Error(
        `Function ${name} not implemented by ${wallet?.walletInfo.prettyName} Client yet.`
      );
    }
    return func(...params);
  }
  const status = wallet?.walletStatus || WalletStatus.Disconnected;
  return {
    chainWallet: wallet,
    chain: wallet?.chainRecord.chain,
    assets: wallet?.chainRecord.assetList,
    logoUrl: wallet?.chainLogoUrl,
    wallet: wallet?.walletInfo,
    address: wallet?.address,
    username: wallet?.username,
    message: wallet ? wallet.message : "No wallet is connected walletly.",
    status,
    isWalletDisconnected: status === "Disconnected",
    isWalletConnecting: status === "Connecting",
    isWalletConnected: status === "Connected",
    isWalletRejected: status === "Rejected",
    isWalletNotExist: status === "NotExist",
    isWalletError: status === "Error",
    connect: () => walletAssert(wallet?.connect, [void 0, sync], "connect"),
    disconnect: () => walletAssert(wallet?.disconnect, [void 0, sync], "disconnect"),
    getRpcEndpoint: (isLazy) => walletAssert(wallet?.getRpcEndpoint, [isLazy], "getRpcEndpoint"),
    getRestEndpoint: (isLazy) => walletAssert(wallet?.getRestEndpoint, [isLazy], "getRestEndpoint"),
    getStargateClient: () => walletAssert(wallet?.getStargateClient, [], "getStargateClient"),
    getCosmWasmClient: () => walletAssert(wallet?.getCosmWasmClient, [], "getCosmWasmClient"),
    getSigningStargateClient: () => walletAssert(
      wallet?.getSigningStargateClient,
      [],
      "getSigningStargateClient"
    ),
    getSigningCosmWasmClient: () => walletAssert(
      wallet?.getSigningCosmWasmClient,
      [],
      "getSigningCosmWasmClient"
    ),
    getNameService: () => walletAssert(wallet?.getNameService, [], "getNameService"),
    estimateFee: (...params) => walletAssert(wallet?.estimateFee, params, "estimateFee"),
    sign: (...params) => walletAssert(wallet?.sign, params, "sign"),
    broadcast: (...params) => walletAssert(wallet?.broadcast, params, "broadcast"),
    signAndBroadcast: (...params) => walletAssert(wallet?.signAndBroadcast, params, "signAndBroadcast"),
    qrUrl: wallet?.client?.qrUrl,
    appUrl: wallet?.client?.appUrl,
    enable: () => clientMethodAssert(
      wallet?.client?.enable.bind(wallet.client),
      [chainId],
      "enable"
    ),
    suggestToken: (...params) => clientMethodAssert(
      wallet?.client?.suggestToken.bind(wallet.client),
      [...params],
      "suggestToken"
    ),
    getAccount: () => clientMethodAssert(
      wallet?.client?.getAccount.bind(wallet.client),
      [chainId],
      "getAccount"
    ),
    getOfflineSigner: () => clientMethodAssert(
      wallet?.client?.getOfflineSigner.bind(wallet.client),
      [chainId, wallet?.preferredSignType],
      "getOfflineSigner"
    ),
    getOfflineSignerAmino: () => clientMethodAssert(
      wallet?.client?.getOfflineSignerAmino.bind(wallet.client),
      [chainId],
      "getOfflineSignerAmino"
    ),
    getOfflineSignerDirect: () => clientMethodAssert(
      wallet?.client?.getOfflineSignerDirect.bind(wallet.client),
      [chainId],
      "getOfflineSignerDirect"
    ),
    signAmino: (...params) => clientMethodAssert(
      wallet?.client?.signAmino.bind(wallet.client),
      [chainId, ...params],
      "signAmino"
    ),
    signDirect: (...params) => clientMethodAssert(
      wallet?.client?.signDirect.bind(wallet.client),
      [chainId, ...params],
      "signDirect"
    ),
    signArbitrary: (...params) => clientMethodAssert(
      wallet?.client?.signArbitrary.bind(wallet.client),
      [chainId, ...params],
      "signArbitrary"
    ),
    sendTx: (...params) => clientMethodAssert(
      wallet?.client?.sendTx.bind(wallet.client),
      [chainId, ...params],
      "sendTx"
    )
  };
}

// src/hooks/useChain.ts
var useChain = (chainName, sync = true) => {
  const context = React2.useContext(walletContext);
  if (!context) {
    throw new Error("You have forgot to use ChainProvider.");
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
    getNameService
  } = walletRepo;
  const chainWalletContext = getChainWalletContext(
    chain.chain_id,
    current,
    sync
  );
  return {
    ...chainWalletContext,
    walletRepo,
    chain,
    assets: assetList,
    openView,
    closeView,
    connect: () => connect(void 0, sync),
    disconnect: () => disconnect(void 0, sync),
    getRpcEndpoint,
    getRestEndpoint,
    getStargateClient,
    getCosmWasmClient,
    getNameService
  };
};
export {
  useChain
};
//# sourceMappingURL=useChain.mjs.map
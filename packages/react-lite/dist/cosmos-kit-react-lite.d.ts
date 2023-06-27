import { AssetList, Chain } from "@chain-registry/types";
import { EndpointOptions, LogLevel, MainWalletBase, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions, WalletManager, WalletModalProps, ChainContext, ChainName, ChainWalletContext, WalletName, ManagerContext, Mutable, NameService, WalletContext, WalletClientContext } from "@cosmos-kit/core";
import React, { ReactNode } from "react";
export const walletContext: React.Context<{
    walletManager: WalletManager;
    modalProvided: boolean;
}>;
export const ChainProvider: ({ chains, assetLists, wallets, walletModal, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: (props: WalletModalProps) => JSX.Element;
    throwErrors?: boolean;
    defaultNameService?: NameServiceName;
    walletConnectOptions?: WalletConnectOptions;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    logLevel?: LogLevel;
    children: ReactNode;
}) => JSX.Element;
export const useChain: (chainName: ChainName, sync?: boolean) => ChainContext;
export const useChainWallet: (chainName: ChainName, walletName: WalletName, sync?: boolean) => ChainWalletContext;
export const useManager: () => ManagerContext;
export const useNameService: (name?: NameServiceName) => Mutable<NameService>;
export const useWallet: (walletName?: WalletName, activeOnly?: boolean) => WalletContext;
export const useWalletClient: (walletName?: WalletName) => WalletClientContext;

//# sourceMappingURL=cosmos-kit-react-lite.d.ts.map

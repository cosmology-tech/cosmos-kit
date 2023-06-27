import { ModalViews, WalletListViewProps, WalletViewProps, WalletModalProps, EndpointOptions, LogLevel, MainWalletBase, NameServiceName, SessionOptions, SignerOptions, WalletConnectOptions } from "@cosmos-kit/core";
import { AssetList, Chain } from "@chain-registry/types";
import { ReactNode } from "react";
type ModalViewImpl = {
    head: React.ReactNode;
    content: React.ReactNode;
};
type ModalViewImplGetter = (props: WalletViewProps | WalletListViewProps) => ModalViewImpl;
declare const defaultModalViews: Record<keyof ModalViews, ModalViewImplGetter>;
export const WalletModal: ({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, }: WalletModalProps & {
    modalViews: typeof defaultModalViews;
    includeAllWalletsOnMobile?: boolean;
}) => JSX.Element;
export const DefaultModal: ({ isOpen, setOpen, walletRepo, }: WalletModalProps) => JSX.Element;
export const ChainProvider: ({ chains, assetLists, wallets, walletModal, modalViews, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel, children, }: {
    chains: Chain[];
    assetLists: AssetList[];
    wallets: MainWalletBase[];
    walletModal?: (props: WalletModalProps) => JSX.Element;
    modalViews?: typeof defaultModalViews;
    wrappedWithChakra?: boolean;
    throwErrors?: boolean;
    defaultNameService?: NameServiceName;
    walletConnectOptions?: WalletConnectOptions;
    signerOptions?: SignerOptions;
    endpointOptions?: EndpointOptions;
    sessionOptions?: SessionOptions;
    logLevel?: LogLevel;
    children: ReactNode;
}) => JSX.Element;
export { useChain, useChainWallet, useManager, useNameService, useWallet, useWalletClient, walletContext, } from '@cosmos-kit/react-lite';

//# sourceMappingURL=cosmos-kit-react.d.ts.map

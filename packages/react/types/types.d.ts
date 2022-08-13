import { ConnectedWallet, CosmosWalletInitializeConfig, CosmosWalletState, Wallet } from '@cosmos-wallet/types';
import { ReactNode } from 'react';
export interface IWalletManagerContext extends CosmosWalletState {
    connect: (wallet?: Wallet) => void;
    disconnect: () => Promise<void>;
    connected: boolean;
}
export interface ModalClassNames {
    modalContent?: string;
    modalOverlay?: string;
    modalHeader?: string;
    modalSubheader?: string;
    modalCloseButton?: string;
    walletList?: string;
    wallet?: string;
    walletImage?: string;
    walletInfo?: string;
    walletName?: string;
    walletDescription?: string;
    textContent?: string;
}
export declare type UseWalletResponse = Partial<ConnectedWallet> & Pick<IWalletManagerContext, 'status' | 'connected' | 'error'>;
export interface WalletManagerProviderProps extends CosmosWalletInitializeConfig {
    children: ReactNode | ReactNode[];
    classNames?: ModalClassNames;
    closeIcon?: ReactNode;
    renderLoader?: () => ReactNode;
}

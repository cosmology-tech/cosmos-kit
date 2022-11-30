import { ModalVersion, WalletManager } from '@cosmos-kit/core';
export declare const getModalDetails: (walletManager: WalletManager, modalIsReset: boolean, resetModal: (v: boolean) => void, handleClose: () => void, initialFocus: RefObject<any>, version: ModalVersion) => JSX.Element[];

import { ModalVersion, WalletManager } from '@cosmos-kit/core';
import { RefObject } from 'react';
export declare const getModal: (walletManager: WalletManager, modalIsReset: boolean, resetModal: (v: boolean) => void, handleClose: () => void, initialFocus: RefObject<any>, version: ModalVersion) => JSX.Element[];

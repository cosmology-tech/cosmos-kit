import { WalletManager } from '@cosmos-kit/core';
import { RefObject } from 'react';
import { UserDeviceInfoType } from './components/types';
export declare const getModal: (userAgent: UserDeviceInfoType | undefined, walletManager: WalletManager, modalIsReset: boolean, resetModal: (v: boolean) => void, handleClose: () => void, initialFocus: RefObject<any>) => JSX.Element[];

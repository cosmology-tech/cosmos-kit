import { ChainWalletBase, ModalVersion } from '@cosmos-kit/core';
import { RefObject } from 'react';
import { DisplayType } from '../types';
export declare const getWalletListView: (version: ModalVersion, wallets: ChainWalletBase[], setOpen: (isOpen: boolean) => void, setDisplay: (display: DisplayType) => void, setWallet: (wallet: ChainWalletBase | undefined) => void, initialFocus: RefObject<any>) => JSX.Element[];

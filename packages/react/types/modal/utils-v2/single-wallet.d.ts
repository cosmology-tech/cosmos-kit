/// <reference types="react" />
import { ChainWalletBase, ModalVersion } from '@cosmos-kit/core';
import { DisplayType } from '../types';
export declare const getSingleWalletView: (version: ModalVersion, current: ChainWalletBase | undefined, qrCodeWallet: ChainWalletBase | undefined, setOpen: (isOpen: boolean) => void, setDisplay: (display: DisplayType) => void, setQRCodeWallet: (wallet: ChainWalletBase | undefined) => void) => JSX.Element[];

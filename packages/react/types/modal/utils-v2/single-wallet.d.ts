import { ChainWalletBase, ModalVersion } from '@cosmos-kit/core';
import { DisplayType } from '../types';
export declare const getSingleWalletView: (version: ModalVersion, wallet: ChainWalletBase | undefined, display: DisplayType, setOpen: (isOpen: boolean) => void, setDisplay: (display: DisplayType) => void) => JSX.Element[];

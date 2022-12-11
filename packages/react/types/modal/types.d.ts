import { WalletStatus } from '@cosmos-kit/core';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { LogoStatus } from './components';
export declare type DisplayType = 'list' | 'single';
export declare type ModalInfo = {
    [k in WalletStatus]: {
        logoStatus?: LogoStatus;
        header?: string;
        desc?: string;
        buttonText?: string;
        onClick?: () => void;
        buttonDisabled?: boolean;
        icon?: IconType | JSX.Element;
        bottomLink?: ReactNode;
    };
};

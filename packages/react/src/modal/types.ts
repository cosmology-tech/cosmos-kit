import { WalletStatus } from '@cosmos-kit/core';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';

import { LogoStatus } from './components';

export type DisplayType = 'list' | 'single' | 'qrcode';

export type ModalInfo = {
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

/// <reference types="react" />
import { DeeplinkFormats } from '@cosmos-wallet/types';
import { BaseModalProps } from './BaseModal';
export interface WalletConnectModalProps extends BaseModalProps {
    uri?: string;
    reset: () => void;
    deeplinkFormats?: DeeplinkFormats;
}
export declare const WalletConnectModal: ({ isOpen, uri, classNames, reset, deeplinkFormats, ...props }: WalletConnectModalProps) => JSX.Element;

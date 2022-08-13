import { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { ModalClassNames } from '../../types';
export declare type BaseModalProps = PropsWithChildren<{
    isOpen: boolean;
    onClose?: () => void;
    title?: ReactElement | string;
    maxWidth?: string;
    classNames?: ModalClassNames;
    closeIcon?: ReactNode;
}>;
export declare const BaseModal: ({ isOpen, onClose, title, maxWidth, classNames, closeIcon, children, }: BaseModalProps) => JSX.Element;
export declare const ModalSubheader: any;

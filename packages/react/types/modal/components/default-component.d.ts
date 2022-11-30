import { ButtonProps, TooltipProps } from '@chakra-ui/react';
import { DefaultCardType, DefaultIconButtonType, DefaultLinkItemType, DefaultLinkType, IconTypeProps } from './types';
export declare function handleChangeColorModeValue(colorMode: string, light: string, dark: string): string;
export declare const DefaultLink: any;
export declare const DefaultIconButton: ({ icon, label, showTooltip, chakraButtonProps, chakraTooltipProps, }: {
    chakraButtonProps?: ButtonProps;
    chakraTooltipProps?: TooltipProps;
} & DefaultIconButtonType) => JSX.Element;
export declare const ListLinkButton: ({ text, chakraButtonProps, }: {
    chakraButtonProps?: ButtonProps;
} & DefaultLinkItemType) => JSX.Element;
export declare const MenuLinkButton: ({ icon, text, size, }: DefaultLinkItemType) => JSX.Element;
export declare const TextWithIconLink: ({ text, icon }: DefaultLinkType) => JSX.Element;
export declare const DefaultIcon: ({ size, icon, }: {
    size?: string;
    icon: IconTypeProps;
}) => JSX.Element;
export declare const DefaultCard: ({ title, children }: DefaultCardType) => JSX.Element;

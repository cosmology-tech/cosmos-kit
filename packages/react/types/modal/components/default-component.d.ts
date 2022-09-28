import React from "react";
import { TooltipProps, ButtonProps } from "@chakra-ui/react";
import { DefaultLinkType, IconTypeProps, DefaultCardType, DefaultLinkItemType, DefaultIconButtonType } from "../types";
export declare const DefaultLink: React.ForwardRefExoticComponent<Pick<any, string | number | symbol> & React.RefAttributes<unknown>>;
export declare const DefaultIconButton: ({ icon, label, showTooltip, chakraButtonProps, chakraTooltipProps, }: {
    chakraButtonProps?: ButtonProps;
    chakraTooltipProps?: TooltipProps;
} & DefaultIconButtonType) => JSX.Element;
export declare const ListLinkButton: ({ text, chakraButtonProps, }: {
    chakraButtonProps?: ButtonProps;
} & DefaultLinkItemType) => JSX.Element;
export declare const MenuLinkButton: ({ icon, text, chakraButtonProps, }: {
    chakraButtonProps?: ButtonProps;
} & DefaultLinkItemType) => JSX.Element;
export declare const TextWithIconLink: ({ text, icon }: DefaultLinkType) => JSX.Element;
export declare const DefaultIcon: ({ icon }: {
    icon: IconTypeProps;
}) => JSX.Element;
export declare const DefaultCard: ({ title, children }: DefaultCardType) => JSX.Element;

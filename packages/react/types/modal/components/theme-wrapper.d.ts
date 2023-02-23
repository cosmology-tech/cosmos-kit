import { Logger } from '@cosmos-kit/core';
export declare function WrapperWithOuterTheme({ logger, children, }: {
    logger?: Logger;
    children: JSX.Element;
}): JSX.Element;
export declare function WrapperWithProvidedTheme({ theme, logger, children, }: {
    children: JSX.Element;
    theme?: Record<string, any>;
    logger?: Logger;
}): JSX.Element;

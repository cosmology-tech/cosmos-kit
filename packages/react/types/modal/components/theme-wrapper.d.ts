/// <reference types="react" />
import { Logger } from '@cosmos-kit/core';
export declare function ChakraProviderWithOuterTheme({ logger, children, }: {
    logger?: Logger;
    children: JSX.Element;
}): JSX.Element;
export declare function ChakraProviderWithGivenTheme({ theme, logger, children, }: {
    children: JSX.Element;
    theme?: Record<string, any>;
    logger?: Logger;
}): JSX.Element;

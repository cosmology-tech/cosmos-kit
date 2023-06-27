import { Logger } from '@cosmos-kit/core';
export { ConnectedView, ConnectingView, ErrorView, NotExistView, QRCodeView, RejectedView, WalletListView, defaultModalViews } from './views/index.js';

declare function ChakraProviderWithOuterTheme({ logger, children, }: {
    logger?: Logger;
    children: JSX.Element;
}): JSX.Element;
declare function ChakraProviderWithGivenTheme({ theme, logger, children, }: {
    children: JSX.Element;
    theme?: Record<string, any>;
    logger?: Logger;
}): JSX.Element;

export { ChakraProviderWithGivenTheme, ChakraProviderWithOuterTheme };

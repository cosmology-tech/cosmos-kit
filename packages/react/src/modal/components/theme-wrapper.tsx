import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@cosmology-ui/react';
import { Logger } from '@cosmos-kit/core';
import { ThemeContext } from '@emotion/react';
import { useContext, useMemo } from 'react';
import { addSemanticTokens, noCssResetTheme } from '../theme';
import React from 'react';

export function ChakraProviderWithOuterTheme({
  logger,
  children,
}: {
  logger?: Logger;
  children: JSX.Element;
}) {
  const outerTheme = useContext(ThemeContext);
  const theme = useMemo(() => addSemanticTokens(outerTheme), [outerTheme]);

  // logger?.debug('[WalletModal] ChakraProvider `theme`:', theme);
  // logger?.debug('[WalletModal] ChakraProvider `resetCSS`:', true);

  return (
    <ThemeProvider>
      <ChakraProvider theme={theme} resetCSS={true}>
        {children}
      </ChakraProvider>
    </ThemeProvider>
  );
}

export function ChakraProviderWithGivenTheme({
  theme,
  logger,
  children,
}: {
  children: JSX.Element;
  theme?: Record<string, any>;
  logger?: Logger;
}) {
  const _theme = useMemo(() => {
    if (theme) {
      return addSemanticTokens(theme);
    } else {
      return noCssResetTheme;
    }
  }, [theme]);

  // logger?.debug('[WalletModal] ChakraProvider `theme`:', _theme);
  // logger?.debug('[WalletModal] ChakraProvider `resetCSS`:', false);

  return (
    <ThemeProvider>
      <ChakraProvider theme={_theme} resetCSS={false}>
        {children}
      </ChakraProvider>
    </ThemeProvider>
  );
}

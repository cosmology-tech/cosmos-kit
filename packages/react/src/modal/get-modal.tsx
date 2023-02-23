import { Logger, ModalViews, WalletModalProps } from '@cosmos-kit/core';
import { WalletModal } from './modal';
import { semanticTokens } from '@cosmology-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { defaultModalViews } from './views';
import { noCssResetTheme } from './theme';

export function getWrappedWalletModal(
  theme: Record<string, any> = noCssResetTheme,
  modalViews: ModalViews = defaultModalViews,
  resetCSS: boolean = true,
  logger?: Logger
) {
  const colors = {
    ...(semanticTokens as any).semanticTokens.colors,
    ...(theme as any)?.semanticTokens?.colors,
  };
  const shadows = {
    ...(semanticTokens as any).semanticTokens.shadows,
    ...(theme as any)?.semanticTokens?.shadows,
  };
  const mergedSemanticTokens = {
    semanticTokens: {
      ...(theme as any)?.semanticTokens,
      colors,
      shadows,
    },
  };
  const themeObject = {
    ...theme,
    ...mergedSemanticTokens,
  };

  logger?.debug('[WalletModal] Applied ChakraProvider `theme`:', themeObject);
  logger?.info('[WalletModal] Applied ChakraProvider `resetCSS`:', resetCSS);

  return ({ isOpen, setOpen, walletRepo }: WalletModalProps) => {
    return (
      <ChakraProvider theme={themeObject} resetCSS={resetCSS}>
        <WalletModal
          isOpen={isOpen}
          setOpen={setOpen}
          walletRepo={walletRepo}
          modalViews={{
            ...defaultModalViews,
            ...modalViews,
          }}
        />
      </ChakraProvider>
    );
  };
}

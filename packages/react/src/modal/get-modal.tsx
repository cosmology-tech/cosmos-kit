import { ModalViews, WalletModalProps } from '@cosmos-kit/core';
import { WalletModal } from './modal';
import { semanticTokens } from '@cosmology-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { defaultModalViews } from './views';
import { noCssResetTheme } from './theme';

export function getWrappedWalletModal(
  theme: Record<string, any> = noCssResetTheme,
  modalViews: ModalViews = defaultModalViews
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

  return ({ isOpen, setOpen, walletRepo }: WalletModalProps) => {
    return (
      <ChakraProvider
        theme={{
          ...theme,
          ...mergedSemanticTokens,
        }}
        resetCSS={true}
      >
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

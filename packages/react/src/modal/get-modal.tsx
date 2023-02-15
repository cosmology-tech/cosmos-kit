import { WalletModalProps } from '@cosmos-kit/core';
import { DefaultModal } from './modal';
import { semanticTokens } from '@cosmology-ui/react';
import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react';
import React from 'react';

export function getDefaultModal(theme?: Record<string, any>) {
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
        colorModeManager={createLocalStorageManager('chakra-ui-color-mode')}
      >
        <DefaultModal
          isOpen={isOpen}
          setOpen={setOpen}
          walletRepo={walletRepo}
        />
      </ChakraProvider>
    );
  };
}

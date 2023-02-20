import { WalletModalProps } from '@cosmos-kit/core';
import { WalletModal } from './modal';
import { semanticTokens } from '@cosmology-ui/react';
import {
  ChakraProvider,
  createLocalStorageManager,
  useColorMode,
} from '@chakra-ui/react';
import React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export function getWrappedWalletModal(theme?: Record<string, any>) {
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

  const emotionCache = createCache({
    key: 'emotion-css-cache',
    prepend: true, // ensures styles are prepended to the <head>, instead of appended
  });

  return ({ isOpen, setOpen, walletRepo }: WalletModalProps) => {
    return (
      <CacheProvider value={emotionCache}>
        <ChakraProvider
          theme={{
            ...theme,
            ...mergedSemanticTokens,
          }}
          // resetCSS={true}
          // colorModeManager={createLocalStorageManager('chakra-ui-color-mode')}
        >
          <WalletModal
            isOpen={isOpen}
            setOpen={setOpen}
            walletRepo={walletRepo}
          />
        </ChakraProvider>
      </CacheProvider>
    );
  };
}

export const DefautModal = getWrappedWalletModal();

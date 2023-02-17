import { WalletModalProps } from '@cosmos-kit/core';
import { WalletModal } from './modal';
import {
  semanticTokens,
  ThemeContext,
  ThemeProvider,
} from '@cosmology-ui/react';
import {
  ChakraProvider,
  createLocalStorageManager,
  useColorMode,
} from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';

export function getWalletModal(theme?: Record<string, any>) {
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
    // const { colorMode } = useColorMode();
    // const context = useContext(ThemeContext);

    // useEffect(() => {
    //   context.handleTheme(colorMode);
    //   console.log(
    //     '%cget-modal.tsx line:33 colorMode',
    //     'color: #007acc;',
    //     colorMode,
    //     context.theme
    //   );
    // }, [context, colorMode]);

    return (
      <ThemeProvider>
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
      </ThemeProvider>
    );
  };
}

export const DefautModal = getWalletModal();

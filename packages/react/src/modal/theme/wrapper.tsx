import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  ChakraProvider,
  createLocalStorageManager,
  useColorMode,
} from '@chakra-ui/react';
import { noCssResetTheme } from './config';
import { semanticTokens } from '@cosmology-ui/react';
import { ThemeContext } from '@emotion/react';

export const ChakraThemeWrapper = ({
  theme,
  children,
}: {
  theme: Record<string, any>;
  children: ReactNode;
}) => {
  const [colorMode, setColorMode] = useState<string | null>('light');
  const { colorMode: _colorMode } = useColorMode();
  const outerTheme = useContext(ThemeContext);

  useEffect(() => {
    setColorMode(window.localStorage.getItem('chakra-ui-color-mode'));
  }, [_colorMode]);

  const colors = {
    ...(semanticTokens as any).semanticTokens.colors,
    ...(outerTheme as any)?.semanticTokens?.colors,
  };
  const shadows = {
    ...(semanticTokens as any).semanticTokens.shadows,
    ...(outerTheme as any)?.semanticTokens?.shadows,
  };
  const mergedSemanticTokens = {
    semanticTokens: {
      ...(outerTheme as any)?.semanticTokens,
      colors,
      shadows,
    },
  };

  if (colorMode) {
    return (
      <ChakraProvider theme={{ ...outerTheme, ...mergedSemanticTokens }}>
        {children}
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider
      theme={{ ...(theme || noCssResetTheme), ...mergedSemanticTokens }}
      resetCSS={true}
      colorModeManager={createLocalStorageManager('chakra-ui-color-mode')} // let modal get global color mode
    >
      {children}
    </ChakraProvider>
  );
};

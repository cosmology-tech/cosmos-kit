import React, { ReactNode, useEffect, useState } from 'react';
import {
  ChakraProvider,
  createLocalStorageManager,
  useColorMode,
} from '@chakra-ui/react';
import { noCssResetTheme } from './config';

export const ThemeWrapper = ({
  theme,
  children,
}: {
  theme: Record<string, any>;
  children: ReactNode;
}) => {
  const [colorMode, setColorMode] = useState<string | null>('light');
  const { colorMode: _colorMode } = useColorMode();

  useEffect(() => {
    setColorMode(window.localStorage.getItem('chakra-ui-color-mode'));
  }, [_colorMode]);

  if (colorMode) {
    return <>{children}</>;
  }

  return (
    <ChakraProvider
      theme={theme || noCssResetTheme}
      resetCSS={true}
      colorModeManager={createLocalStorageManager('chakra-ui-color-mode')} // let modal get global color mode
    >
      {children}
    </ChakraProvider>
  );
};

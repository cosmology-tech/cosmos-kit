import {
  ColorMode,
  ColorModeProvider,
  CSSReset,
  GlobalStyle,
  ThemeProvider,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import { defaultTheme } from '../theme';

export const StyleProvider = ({
  colorMode,
  children,
}: {
  colorMode: ColorMode;
  children: ReactNode;
}) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <ColorModeProvider
        value={colorMode}
        options={{
          useSystemColorMode: false,
          initialColorMode: 'light',
        }}
      >
        <CSSReset />
        <GlobalStyle />
        {children}
      </ColorModeProvider>
    </ThemeProvider>
  );
};

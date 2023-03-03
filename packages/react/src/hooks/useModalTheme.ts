import { ThemeContext as themeContext, Themes } from '@cosmology-ui/react';
import { ModalThemeContext, ModalTheme } from '@cosmos-kit/core';
import React from 'react';

export const useModalTheme = (): ModalThemeContext => {
  const context = React.useContext(themeContext);

  if (!context) {
    throw new Error('You have forgot to use ThemeProvider.');
  }

  return {
    modalTheme: context.theme.toString() as ModalTheme,
    setModalTheme: (theme: ModalTheme) => {
      switch (theme) {
        case 'dark':
          context.setTheme(Themes.Dark);
          break;
        case 'light':
          context.setTheme(Themes.Light);
          break;
      }
    },
  };
};

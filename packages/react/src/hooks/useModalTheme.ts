import { ModePreference, useTheme } from '@interchain-ui/react';
import * as React from 'react';

export function useModalTheme() {
  const { theme, setColorMode } = useTheme();

  const value = React.useMemo(() => theme, [theme]);

  const setModalTheme = React.useCallback((mode: ModePreference) => {
    setColorMode(mode);
  }, []);

  return {
    modalTheme: value,
    setModalTheme,
  };
}

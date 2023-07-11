import { ModePreference, store } from '@interchain-ui/react';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

const useStore = create(store);

const useCosmologyUIStore = () => {
  return useStore(
    (state) => ({
      theme: state.theme,
      themeClass: state.themeClass,
      setThemeMode: state.setThemeMode,
    }),
    shallow
  );
};

export function useModalTheme() {
  const { theme, setThemeMode } = useCosmologyUIStore();

  const value = useMemo(() => theme, [theme]);

  const setModalTheme = useCallback((mode: ModePreference) => {
    setThemeMode(mode);
  }, []);

  return {
    modalTheme: value,
    setModalTheme,
  };
}

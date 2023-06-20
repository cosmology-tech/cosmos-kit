import { ModePreference, store } from '@cosmology-ui/react';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

const useStore = create(store);

const useCosmologyUIStore = () => {
  return useStore(
    (state) => ({
      theme: state.theme,
      themeClass: state.themeClass,
      setTheme: state.setTheme,
    }),
    shallow
  );
};

export function useModalTheme() {
  const { theme, setTheme } = useCosmologyUIStore();

  const value = useMemo(() => theme, [theme]);

  const setModalTheme = useCallback((mode: ModePreference) => {
    setTheme(mode);
  }, []);

  return {
    modalTheme: value,
    setModalTheme,
  };
}

import { computed, ref } from 'vue';
import { ModePreference, useTheme } from '@interchain-ui/vue';

export function useModalTheme() {
  const { theme, setColorMode } = useTheme();

  const modalTheme = computed(() => theme.value);
  const setModalTheme = (mode: ModePreference) => {
    setColorMode(mode);
  };

  return {
    modalTheme,
    setModalTheme,
  };
}

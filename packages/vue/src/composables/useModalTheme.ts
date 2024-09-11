import { ref } from "vue";

type ModalTheme = "light" | "dark" | "system";
export function useModalTheme() {
  const modalTheme = ref<ModalTheme>("light");

  function setModalTheme(theme: ModalTheme) {
    modalTheme.value = theme;
  }

  return {
    modalTheme,
    setModalTheme,
  };
}

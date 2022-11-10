// use for let color mode value fit Rules of Hooks
export function handleChangeColorModeValue(
  colorMode: string,
  light: any,
  dark: any
) {
  if (colorMode === "light") return light;
  if (colorMode === "dark") return dark;
}

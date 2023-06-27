// src/hooks/useModalTheme.ts
import { ThemeContext as themeContext, Themes } from "@cosmology-ui/react";
import React from "react";
var useModalTheme = () => {
  const context = React.useContext(themeContext);
  if (!context) {
    throw new Error("You have forgot to use ThemeProvider.");
  }
  return {
    modalTheme: context.theme.toString(),
    setModalTheme: (theme) => {
      switch (theme) {
        case "dark":
          context.setTheme(Themes.Dark);
          break;
        case "light":
          context.setTheme(Themes.Light);
          break;
      }
    }
  };
};
export {
  useModalTheme
};
//# sourceMappingURL=index.mjs.map
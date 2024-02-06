import * as React from "react";

interface UseNextraThemeOptions {
  onThemeChange?: (theme: "light" | "dark") => void;
}

export const useNextraTheme = (opts: UseNextraThemeOptions) => {
  let [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    const handleThemeChange = () => {
      const htmlTag = document.getElementsByTagName("html")[0];

      if (htmlTag.classList.contains("light")) {
        opts.onThemeChange?.("light");
        setTheme("light");
      } else if (htmlTag.classList.contains("dark")) {
        opts.onThemeChange?.("dark");
        setTheme("dark");
      }
    };

    // Initial theme check
    handleThemeChange();

    // Listen for class name changes
    const observer = new MutationObserver(handleThemeChange);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect(); // Clean up the observer
    };
  }, []);

  return [theme, setTheme];
};

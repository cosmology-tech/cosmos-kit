// import { WalletModal } from "@cosmos-kit/react";
import { useEffect, useState } from "react";

function TestStyle() {
  const [open, setOpen] = useState(false);
  const [colorMode, setColorMode] = useState<string | null>(null);

  function handleOpen() {
    setOpen(!open);
  }

  function handleColorMode() {
    setColorMode(colorMode === "light" ? "dark" : "light");
    if (colorMode === "light") {
      window.localStorage.setItem("chakra-ui-color-mode", "dark");
    } else {
      window.localStorage.setItem("chakra-ui-color-mode", "light");
    }
  }

  // set system color to default color mode
  useEffect(() => {
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setColorMode(systemDark ? "dark" : "light");
    window.localStorage.setItem(
      "chakra-ui-color-mode",
      systemDark ? "dark" : "light"
    );
  }, []);

  return (
    <div>
      <button
        style={{ background: "#f3c674", padding: 4, margin: 16 }}
        onClick={handleOpen}
      >
        open modal
      </button>
      <button
        style={{ background: "#f6c3fb", padding: 4, margin: 16 }}
        onClick={handleColorMode}
      >
        color mode
      </button>
      {/* <WalletModal isOpen={open} setOpen={handleOpen} /> */}
      <p>test weight</p>
    </div>
  );
}

export default TestStyle;

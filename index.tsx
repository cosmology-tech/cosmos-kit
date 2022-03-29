import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { GetKeplrProvider } from "./providers/wc-keplr";
import { StoreProvider } from "./stores";

import "./styles/index.css";

ReactDOM.render(
  <React.StrictMode>
    <GetKeplrProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </GetKeplrProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

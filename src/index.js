import React from "react";
import ReactDOM from "react-dom";
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";
import "./index.css";
import App from "./App.jsx";

// Support the Rinkeby chain
const supportedChainIds = [4];

// Support the Metamask wallet
const connectors = {
  injected: {},
};

ReactDOM.render(
  <React.StrictMode>
    <ThirdwebWeb3Provider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <App />
    </ThirdwebWeb3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

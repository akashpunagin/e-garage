import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { register } from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

register();

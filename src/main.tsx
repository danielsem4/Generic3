import "./index.css";
import "@/lib/i18n";
import ReactDOM from "react-dom/client";
import React from "react";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

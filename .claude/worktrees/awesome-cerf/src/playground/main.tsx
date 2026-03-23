import React from "react";
import ReactDOM from "react-dom/client";
import { Playground } from "./Playground";
import "../tokens/reset.css";
import "../tokens/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>,
);

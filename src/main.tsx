import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import "./i18n";
import "./styles/base.css";
import "./styles/welcome.css";
import "./styles/career-status.css";
import "./index.css";
import "./styles/final-screen.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

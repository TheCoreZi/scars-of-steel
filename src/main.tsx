import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-700.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/quantico/latin-400.css";
import "@fontsource/quantico/latin-700.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App";
import "./i18n";
import "./styles/base.css";
import "./styles/welcome.css";
import "./styles/career-status.css";
import "./index.css";
import "./styles/final-screen.css";

void renderApp();

async function renderApp() {
  let app = <App />;
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("review-events")
  ) {
    const { EventReviewApp } = await import("./app/EventReviewApp");
    app = <EventReviewApp />;
  }
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("review-zoids")
  ) {
    const { ZoidReviewApp } = await import("./app/ZoidReviewApp");
    app = <ZoidReviewApp />;
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>{app}</StrictMode>,
  );
}

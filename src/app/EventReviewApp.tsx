import { useEffect, useState } from "react";
import "../styles/event-review.css";

import { AppControls } from "./AppControls";
import {
  loadColorModePreference,
  saveColorModePreference,
} from "./colorModeStorage";
import { EventReviewPage } from "./EventReviewPage";
import { FanProjectFooter } from "./FanProjectFooter";

export function EventReviewApp() {
  const [colorMode, setColorMode] = useState(loadColorModePreference);

  useEffect(() => {
    saveColorModePreference(colorMode);
  }, [colorMode]);

  return (
    <div
      className="app-shell event-review-shell"
      data-color-mode={colorMode}
      data-faction="neutral"
    >
      <AppControls colorMode={colorMode} onColorModeChange={setColorMode} />
      <EventReviewPage initialCsv="" />
      <FanProjectFooter />
    </div>
  );
}

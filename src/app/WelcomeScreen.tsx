import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimationToggle } from "./AppControls";
import { Badge, Button, Panel } from "./UiPrimitives";

const welcomeFacts = {
  decisions: 5,
  factions: 2,
  paths: 21,
  wars: 1,
} as const;

interface WelcomeScreenProps {
  onReducedMotionChange: (reducedMotion: boolean) => void;
  onStart: () => void;
  reducedMotion: boolean;
}

export function WelcomeScreen({
  onReducedMotionChange,
  onStart,
  reducedMotion,
}: WelcomeScreenProps) {
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const titleId = useId();
  const { t } = useTranslation("interface");

  function handleStart() {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    setStarted(true);
    onStart();
  }

  return (
    <main className="screen welcome">
      <Panel className="welcome__panel" labelledBy={titleId}>
        <AnimationToggle
          onReducedMotionChange={onReducedMotionChange}
          reducedMotion={reducedMotion}
        />
        <div className="welcome__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Badge>{t("welcome.badge")}</Badge>
        <div className="welcome__heading">
          <div className="welcome__brand">
            <img
              alt=""
              className="welcome__logo"
              src="/images/brand/scars-of-steel-mark.png"
            />
            <h1 id={titleId}>{t("welcome.title")}</h1>
          </div>
          <p className="welcome__description">{t("welcome.description")}</p>
          <p className="welcome__journey">{t("welcome.journey")}</p>
          <p className="welcome__call-to-action">{t("welcome.callToAction")}</p>
        </div>
        <dl aria-label={t("welcome.facts.label")} className="welcome__facts">
          <div>
            <dd>{welcomeFacts.factions}</dd>
            <dt>{t("welcome.facts.factions")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.decisions}</dd>
            <dt>{t("welcome.facts.decisions")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.paths}</dd>
            <dt>{t("welcome.facts.paths")}</dt>
          </div>
          <div>
            <dd>{welcomeFacts.wars}</dd>
            <dt>{t("welcome.facts.wars")}</dt>
          </div>
        </dl>
        <Button disabled={started} onClick={handleStart}>
          {t("welcome.start")}
        </Button>
      </Panel>
    </main>
  );
}

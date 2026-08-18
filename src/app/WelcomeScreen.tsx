import { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge, Button, Panel } from "./UiPrimitives";

const welcomeFacts = {
  decisions: 5,
  factions: 2,
  paths: 21,
  wars: 1,
} as const;

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
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
        <div className="welcome__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <Badge>{t("welcome.badge")}</Badge>
        <div className="welcome__heading">
          <h1 id={titleId}>{t("welcome.title")}</h1>
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

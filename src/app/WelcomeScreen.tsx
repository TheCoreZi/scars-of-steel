import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Badge, Button, Panel } from "./UiPrimitives";

const welcomeFacts = {
  decisions: 5,
  factions: 2,
  paths: 21,
  wars: 1,
} as const;

type ColorMode = "dark" | "light";
type Language = "en" | "es";

const languages: Language[] = ["en", "es"];

interface WelcomeScreenProps {
  colorMode: ColorMode;
  onColorModeChange: (colorMode: ColorMode) => void;
  onStart: () => void;
}

export function WelcomeScreen({
  colorMode,
  onColorModeChange,
  onStart,
}: WelcomeScreenProps) {
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const titleId = useId();
  const { i18n, t } = useTranslation("interface");

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  function changeLanguage(language: Language) {
    void i18n.changeLanguage(language);
  }

  function handleStart() {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    setStarted(true);
    onStart();
  }

  function toggleColorMode() {
    onColorModeChange(colorMode === "dark" ? "light" : "dark");
  }

  return (
    <main className="screen welcome">
      <div aria-hidden="true" className="welcome__damage">
        <div className="welcome__claws">
          <span />
          <span />
          <span />
        </div>
        <div className="welcome__bullets">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <div className="welcome__controls">
        <div
          aria-label={t("welcome.language.label")}
          className="language-selector"
          role="group"
        >
          {languages.map((language) => (
            <button
              aria-label={t(`welcome.language.${language}`)}
              aria-pressed={i18n.resolvedLanguage === language}
              key={language}
              onClick={() => changeLanguage(language)}
              type="button"
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          aria-checked={colorMode === "light"}
          aria-label={t("welcome.colorMode.light")}
          className="color-mode-toggle"
          onClick={toggleColorMode}
          role="switch"
          type="button"
        >
          <span aria-hidden="true" className="color-mode-toggle__icon" />
        </button>
      </div>
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

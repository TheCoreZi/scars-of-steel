import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  saveLanguagePreference,
  supportedLanguages,
  type Language,
} from "../i18n";
import type { ColorMode } from "./colorModeStorage";

export type { ColorMode } from "./colorModeStorage";

interface AppControlsProps {
  colorMode: ColorMode;
  onColorModeChange: (colorMode: ColorMode) => void;
}

export function AppControls({
  colorMode,
  onColorModeChange,
}: AppControlsProps) {
  const { i18n, t } = useTranslation("interface");

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  function changeLanguage(language: Language) {
    saveLanguagePreference(language);
    void i18n.changeLanguage(language);
  }

  function toggleColorMode() {
    onColorModeChange(colorMode === "dark" ? "light" : "dark");
  }

  return (
    <nav aria-label={t("appControls.label")} className="app-controls">
      <div
        aria-label={t("welcome.language.label")}
        className="language-selector"
        role="group"
      >
        {supportedLanguages.map((language) => (
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
    </nav>
  );
}

interface AnimationToggleProps {
  onReducedMotionChange: (reducedMotion: boolean) => void;
  reducedMotion: boolean;
}

export function AnimationToggle({
  onReducedMotionChange,
  reducedMotion,
}: AnimationToggleProps) {
  const { t } = useTranslation("interface");
  const animationsEnabled = !reducedMotion;

  return (
    <button
      aria-checked={animationsEnabled}
      aria-label={t(
        animationsEnabled ? "welcome.animations.on" : "welcome.animations.off",
      )}
      className="animation-toggle"
      onClick={() => onReducedMotionChange(animationsEnabled)}
      role="switch"
      type="button"
    >
      <span className="animation-toggle__text">
        {t(
          animationsEnabled
            ? "welcome.animations.on"
            : "welcome.animations.off",
        )}
      </span>
      <span aria-hidden="true" className="animation-toggle__icon" />
    </button>
  );
}

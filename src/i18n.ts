import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import type { TranslationKey } from "./domain/types";
import achievementsEn from "./locales/en/achievements.json";
import decisionsEn from "./locales/en/decisions.json";
import interfaceEn from "./locales/en/interface.json";
import narrativeEn from "./locales/en/narrative.json";
import nicknamesEn from "./locales/en/nicknames.json";
import outcomesEn from "./locales/en/outcomes.json";
import titlesEn from "./locales/en/titles.json";
import zoidsEn from "./locales/en/zoids.json";
import achievements from "./locales/es/achievements.json";
import decisions from "./locales/es/decisions.json";
import interfaceTranslations from "./locales/es/interface.json";
import narrative from "./locales/es/narrative.json";
import nicknames from "./locales/es/nicknames.json";
import outcomes from "./locales/es/outcomes.json";
import titles from "./locales/es/titles.json";
import zoids from "./locales/es/zoids.json";

export const defaultNamespace = "interface";
export const resources = {
  en: {
    achievements: achievementsEn,
    decisions: decisionsEn,
    interface: interfaceEn,
    narrative: narrativeEn,
    nicknames: nicknamesEn,
    outcomes: outcomesEn,
    titles: titlesEn,
    zoids: zoidsEn,
  },
  es: {
    achievements,
    decisions,
    interface: interfaceTranslations,
    narrative,
    nicknames,
    outcomes,
    titles,
    zoids,
  },
} as const;

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  fallbackLng: "en",
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  lng: "en",
  missingKeyHandler: import.meta.env.DEV
    ? (_languages, namespace, key) => {
        throw new Error(`Missing translation key "${namespace}:${key}".`);
      }
    : undefined,
  resources,
  saveMissing: import.meta.env.DEV,
  supportedLngs: ["en", "es"],
});

export function translate(
  key: TranslationKey,
  options?: Record<string, number | string>,
): string {
  return i18n.t(key as never, options as never) as unknown as string;
}

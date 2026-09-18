import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import type { TranslationKey } from "./domain/types";
import achievementsEn from "./locales/en/achievements.json";
import decisionsEn from "./locales/en/decisions.json";
import earlyServiceEn from "./locales/en/early-service.json";
import militaryLifeEn from "./locales/en/military-life.json";
import interfaceEn from "./locales/en/interface.json";
import narrativeEn from "./locales/en/narrative.json";
import nicknamesEn from "./locales/en/nicknames.json";
import outcomesEn from "./locales/en/outcomes.json";
import titlesEn from "./locales/en/titles.json";
import zoidsEn from "./locales/en/zoids.json";
import achievements from "./locales/es/achievements.json";
import decisions from "./locales/es/decisions.json";
import earlyService from "./locales/es/early-service.json";
import militaryLife from "./locales/es/military-life.json";
import interfaceTranslations from "./locales/es/interface.json";
import narrative from "./locales/es/narrative.json";
import nicknames from "./locales/es/nicknames.json";
import outcomes from "./locales/es/outcomes.json";
import titles from "./locales/es/titles.json";
import zoids from "./locales/es/zoids.json";
import academyEn from "./locales/en/academy.json";
import academyEs from "./locales/es/academy.json";
import academyUiEn from "./locales/en/academy-ui.json";
import academyUiEs from "./locales/es/academy-ui.json";

export const defaultNamespace = "interface";
export const languageStorageKey = "scars-of-steel:language";
export const resources = {
  en: {
    achievements: achievementsEn,
    decisions: {
      ...decisionsEn,
      ...academyEn.decisions,
      ...earlyServiceEn.decisions,
      ...militaryLifeEn.decisions,
    },
    interface: { ...interfaceEn, ...academyUiEn },
    narrative: {
      ...narrativeEn,
      ...academyEn.narrative,
      ...earlyServiceEn.narrative,
      ...militaryLifeEn.narrative,
    },
    nicknames: nicknamesEn,
    outcomes: {
      ...outcomesEn,
      ...academyEn.outcomes,
      ...earlyServiceEn.outcomes,
      ...militaryLifeEn.outcomes,
    },
    titles: titlesEn,
    zoids: zoidsEn,
  },
  es: {
    achievements,
    decisions: {
      ...decisions,
      ...academyEs.decisions,
      ...earlyService.decisions,
      ...militaryLife.decisions,
    },
    interface: { ...interfaceTranslations, ...academyUiEs },
    narrative: {
      ...narrative,
      ...academyEs.narrative,
      ...earlyService.narrative,
      ...militaryLife.narrative,
    },
    nicknames,
    outcomes: {
      ...outcomes,
      ...academyEs.outcomes,
      ...earlyService.outcomes,
      ...militaryLife.outcomes,
    },
    titles,
    zoids,
  },
} as const;
export const supportedLanguages = ["en", "es"] as const;
export type Language = (typeof supportedLanguages)[number];

export function loadLanguagePreference(): Language {
  let storedLanguage: string | null = null;

  try {
    storedLanguage = window.localStorage.getItem(languageStorageKey);
  } catch {
    // Use the browser language when storage is unavailable.
  }

  const browserLanguages =
    typeof navigator === "undefined"
      ? []
      : [...navigator.languages, navigator.language];

  for (const candidate of [storedLanguage, ...browserLanguages]) {
    const language = candidate?.toLowerCase().split("-")[0];

    if (supportedLanguages.includes(language as Language)) {
      return language as Language;
    }
  }

  return "en";
}

export function saveLanguagePreference(language: Language) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // Keep the selected language in memory when storage is unavailable.
  }
}

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  fallbackLng: "en",
  initAsync: false,
  interpolation: {
    escapeValue: false,
  },
  lng: loadLanguagePreference(),
  missingKeyHandler: import.meta.env.DEV
    ? (_languages, namespace, key) => {
        throw new Error(`Missing translation key "${namespace}:${key}".`);
      }
    : undefined,
  resources,
  saveMissing: import.meta.env.DEV,
  supportedLngs: supportedLanguages,
});

export function translate(
  key: TranslationKey,
  options?: Record<string, number | string>,
): string {
  return i18n.t(key as never, options as never) as unknown as string;
}

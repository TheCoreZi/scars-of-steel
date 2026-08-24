import { afterEach, describe, expect, test, vi } from "vitest";

import { achievementDescriptionKeys } from "../domain/achievements";
import { getNicknameKey, nicknameIds } from "../domain/nicknames";
import { titleCatalog } from "../domain/titles";
import {
  i18n,
  languageStorageKey,
  loadLanguagePreference,
  saveLanguagePreference,
} from "../i18n";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("language preference", () => {
  test("uses the saved language before the browser language", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["en-US"]);
    window.localStorage.setItem(languageStorageKey, "es");

    expect(loadLanguagePreference()).toBe("es");
  });

  test("uses a supported regional browser language", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue([
      "es-MX",
      "en-US",
    ]);

    expect(loadLanguagePreference()).toBe("es");
  });

  test("saves the selected language", () => {
    saveLanguagePreference("es");

    expect(window.localStorage.getItem(languageStorageKey)).toBe("es");
  });

  test("continues when browser storage fails", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage is unavailable.");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full.");
    });
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["es-MX"]);

    expect(loadLanguagePreference()).toBe("es");
    expect(() => saveLanguagePreference("es")).not.toThrow();
  });
});

test("interpolates pilot values", () => {
  expect(
    i18n.t("pilot.summary", {
      age: 18,
      faction: "Helic Republic",
      name: "Lena",
      nickname: "Steel Claw",
      ns: "narrative",
    }),
  ).toBe(
    "Lena, known as Steel Claw, is 18 years old and belongs to the Helic Republic.",
  );
});

test("provides Spanish resources", () => {
  expect(i18n.getFixedT("es", "interface")("app.title")).toBe(
    "Cicatrices de Acero",
  );
});

test("formats the localized final pilot name", () => {
  expect(
    i18n.getFixedT("en", "interface")("finalScreen.pilotName", {
      faction: "the Republic",
      name: "Jorge",
      nickname: "The Claw",
    }),
  ).toBe("Jorge “The Claw” of the Republic");
  expect(
    i18n.getFixedT("es", "interface")("finalScreen.pilotName", {
      faction: "la República",
      name: "Jorge",
      nickname: "La Garra",
    }),
  ).toBe("Jorge “La Garra” de la República");
});

test("provides every final distinction in both languages", () => {
  for (const language of ["en", "es"]) {
    for (const descriptionKey of Object.values(achievementDescriptionKeys)) {
      expect(i18n.exists(descriptionKey, { lng: language })).toBe(true);
    }

    for (const nicknameId of nicknameIds) {
      expect(i18n.exists(getNicknameKey(nicknameId), { lng: language })).toBe(
        true,
      );
    }

    for (const title of titleCatalog) {
      expect(i18n.exists(title.descriptionKey, { lng: language })).toBe(true);
      expect(i18n.exists(title.nameKey, { lng: language })).toBe(true);
    }
  }
});

test("describes a career that ends without a Zoid", () => {
  expect(i18n.getFixedT("en", "interface")("finalScreen.noZoid")).toBe(
    "Career ended without a Zoid",
  );
  expect(i18n.getFixedT("es", "interface")("finalScreen.noZoid")).toBe(
    "Terminó su carrera sin Zoids",
  );
});

test("throws when a translation key is missing", () => {
  expect(() => i18n.t("missing.key" as never)).toThrowError(
    'Missing translation key "interface:missing.key".',
  );
});

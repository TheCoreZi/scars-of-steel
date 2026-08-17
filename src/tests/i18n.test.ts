import { expect, test } from "vitest";

import { i18n } from "../i18n";

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

test("throws when a translation key is missing", () => {
  expect(() => i18n.t("missing.key" as never)).toThrowError(
    'Missing translation key "interface:missing.key".',
  );
});

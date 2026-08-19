import { describe, expect, test } from "vitest";

import { getZoid, validateZoids, zoids } from "../domain/zoids";
import {
  hasInitialZoidPool,
  initialZoidPools,
  validateZoidPools,
} from "../domain/zoidPools";
import { translate } from "../i18n";

describe("initial Zoid catalog", () => {
  test("defines 56 unique Zoids", () => {
    expect(zoids).toHaveLength(56);
    expect(new Set(zoids.map((zoid) => zoid.id)).size).toBe(56);
  });

  test("keeps every initial pool separate from the catalog", () => {
    for (const faction of ["guylos", "helic"] as const) {
      for (const category of [
        "rare",
        "standard",
        "super-rare",
        "weak",
      ] as const) {
        expect(hasInitialZoidPool(category, faction)).toBe(true);
      }
    }
  });

  test("rejects duplicate Zoid identifiers", () => {
    expect(() => validateZoids([zoids[0], zoids[0]])).toThrow(
      "Duplicate Zoid identifier",
    );
  });

  test("associates 38 existing sprites without substitutions", () => {
    const illustratedZoids = zoids.filter((zoid) => zoid.imagePath);

    expect(illustratedZoids).toHaveLength(38);
    expect(new Set(illustratedZoids.map((zoid) => zoid.imagePath)).size).toBe(
      38,
    );
    expect(
      illustratedZoids.every((zoid) =>
        zoid.imagePath?.startsWith("/images/zoids/"),
      ),
    ).toBe(true);
  });

  test("finds Zoids by identifier", () => {
    expect(getZoid("zoid:command-wolf")).toMatchObject({
      basePower: 35,
      faction: "helic",
      imagePath: "/images/zoids/command_wolf.png",
    });
    expect(() => getZoid("zoid:missing")).toThrow("Unknown Zoid identifier");
  });

  test("validates the initial pools against the catalog", () => {
    expect(() => validateZoidPools(initialZoidPools)).not.toThrow();
    expect(
      Object.values(initialZoidPools).flatMap((categories) =>
        Object.values(categories).flat(),
      ),
    ).toHaveLength(56);
  });

  test("provides a localized name for every Zoid", () => {
    for (const zoid of zoids) {
      expect(translate(zoid.nameKey)).toBeTruthy();
    }
  });
});

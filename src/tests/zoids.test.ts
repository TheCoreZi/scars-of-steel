import { describe, expect, test, vi } from "vitest";

import { getZoid, validateZoids, zoids } from "../domain/zoids";
import {
  hasInitialZoidPool,
  initialZoidPools,
  selectInitialZoid,
  selectZoidFromPool,
  validateZoidPools,
  type ZoidPools,
} from "../domain/zoidPools";
import { createSeededRandomGenerator } from "../domain/random";
import { i18n, supportedLanguages } from "../i18n";

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

  test("associates 56 existing sprites without substitutions", () => {
    const illustratedZoids = zoids.filter((zoid) => zoid.imagePath);

    expect(illustratedZoids).toHaveLength(56);
    expect(new Set(illustratedZoids.map((zoid) => zoid.imagePath)).size).toBe(
      56,
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
    expect(getZoid("zoid:black-rhymos").imagePath).toBe(
      "/images/zoids/black_rhimos.png",
    );
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

  test("selects a Zoid with default pool weights", () => {
    const zoid = selectInitialZoid(
      "rare",
      "helic",
      createSeededRandomGenerator(42),
    );

    expect(initialZoidPools.helic.rare.map(({ id }) => id)).toContain(zoid.id);
  });

  test("passes default and explicit weights to the random generator", () => {
    const random = createSeededRandomGenerator(42);
    const weighted = vi.spyOn(random, "weighted");

    selectZoidFromPool(
      [{ id: "zoid:command-wolf" }, { id: "zoid:gordos", weight: 3 }],
      random,
    );

    expect(weighted).toHaveBeenCalledWith([
      { value: "zoid:command-wolf", weight: 1 },
      { value: "zoid:gordos", weight: 3 },
    ]);
  });

  test("rejects an invalid explicit pool weight", () => {
    const pools = {
      ...initialZoidPools,
      helic: {
        ...initialZoidPools.helic,
        rare: initialZoidPools.helic.rare.map((entry, index) =>
          index === 0 ? { ...entry, weight: 0 } : entry,
        ),
      },
    } satisfies ZoidPools;

    expect(() => validateZoidPools(pools)).toThrow("invalid pool weight");
  });

  test("provides every Zoid name in each language", () => {
    for (const zoid of zoids) {
      for (const language of supportedLanguages) {
        expect(i18n.exists(zoid.nameKey, { lng: language })).toBe(true);
      }
    }
  });
});

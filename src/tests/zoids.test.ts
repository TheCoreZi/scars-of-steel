import { describe, expect, test, vi } from "vitest";

import { createInitialPilot } from "../domain/pilot";
import { createBoundedValue, type Pilot } from "../domain/types";
import {
  getZoid,
  getEffectiveZoidPower,
  validateZoids,
  zoids,
} from "../domain/zoids";
import {
  isZoidRewardPoolAvailable,
  selectRewardZoid,
  zoidPools,
  validateZoidPools,
} from "../domain/zoidPools";
import type { ZoidPoolCatalog } from "../domain/zoidPoolDefinitions";
import { createSeededRandomGenerator } from "../domain/random";
import { i18n, supportedLanguages } from "../i18n";

describe("initial Zoid catalog", () => {
  test("defines 68 unique Zoids including military rewards", () => {
    expect(zoids).toHaveLength(68);
    expect(new Set(zoids.map((zoid) => zoid.id)).size).toBe(68);
  });

  test("keeps every initial pool separate from the catalog", () => {
    for (const faction of ["guylos", "helic"] as const) {
      for (const category of [
        "rare",
        "standard",
        "super-rare",
        "weak",
      ] as const) {
        expect(isZoidRewardPoolAvailable(category, faction)).toBe(true);
      }
    }
  });

  test("rejects duplicate Zoid identifiers", () => {
    expect(() => validateZoids([zoids[0], zoids[0]])).toThrow(
      "Duplicate Zoid identifier",
    );
  });

  test("associates one exact sprite with every Zoid", () => {
    const illustratedZoids = zoids.filter((zoid) => zoid.imagePath);

    expect(illustratedZoids).toHaveLength(68);
    expect(getZoid("zoid:command-wolf-empire").imagePath).toBe(
      "/images/zoids/command_wolf_empire.png",
    );
    expect(new Set(illustratedZoids.map((zoid) => zoid.imagePath)).size).toBe(
      68,
    );
    expect(
      illustratedZoids.every((zoid) =>
        zoid.imagePath?.startsWith("/images/zoids/"),
      ),
    ).toBe(true);
  });

  test("finds Zoids by identifier", () => {
    expect(getZoid("zoid:elephantus")).toMatchObject({
      imagePath: "/images/zoids/elephantus.png",
    });
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
    expect(() => validateZoidPools(zoidPools)).not.toThrow();
    expect(
      (["rare", "standard", "super-rare", "weak"] as const).flatMap((poolId) =>
        Object.values(zoidPools[poolId]).flat(),
      ),
    ).toHaveLength(56);
  });

  test("selects a Zoid with default pool weights", () => {
    const zoid = selectRewardZoid(
      "rare",
      "helic",
      createSeededRandomGenerator(42),
    )!;

    expect(zoidPools.rare.helic.map(({ id }) => id)).toContain(zoid.id);
  });

  test("passes default and explicit weights to the random generator", () => {
    const random = createSeededRandomGenerator(42);
    const weighted = vi.spyOn(random, "weighted");

    selectRewardZoid("military-prototypes", "helic", random);

    expect(weighted).toHaveBeenCalledWith(
      zoidPools["military-prototypes"].helic.map(({ id, weight = 1 }) => ({
        value: id,
        weight,
      })),
    );
  });

  test("rejects an invalid explicit pool weight", () => {
    const pools = {
      ...zoidPools,
      rare: {
        ...zoidPools.rare,
        helic: zoidPools.rare.helic.map((entry, index) =>
          index === 0 ? { ...entry, weight: 0 } : entry,
        ),
      },
    } satisfies ZoidPoolCatalog;

    expect(() => validateZoidPools(pools)).toThrow("invalid pool weight");
  });

  test("rejects duplicate entries inside one pool", () => {
    const pools = {
      ...zoidPools,
      rare: {
        ...zoidPools.rare,
        helic: [...zoidPools.rare.helic, zoidPools.rare.helic[0]],
      },
    } satisfies ZoidPoolCatalog;

    expect(() => validateZoidPools(pools)).toThrow("Duplicate Zoid");
  });

  test("provides every Zoid name in each language", () => {
    for (const zoid of zoids) {
      for (const language of supportedLanguages) {
        expect(i18n.exists(zoid.nameKey, { lng: language })).toBe(true);
      }
    }
  });
});

describe("Zoid improvements", () => {
  test.each([
    [0, 40],
    [1, 46],
    [2, 52],
    [3, 58],
    [20, 100],
  ])("applies %s improvements as a linear power bonus", (upgrades, power) => {
    const initialPilot = createInitialPilot({
      aspiration: "zoid-ace",
      faction: "helic",
      id: "pilot:zoid-power",
      name: "Lena",
    });
    const pilot: Pilot = {
      ...initialPilot,
      zoidProgress: {
        "zoid:command-wolf": {
          power: createBoundedValue(40),
          upgrades,
        },
      },
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:command-wolf",
      },
    };

    expect(getEffectiveZoidPower(pilot, "zoid:command-wolf")).toBe(power);
    expect(pilot.zoidProgress?.["zoid:command-wolf"]?.power).toBe(40);
  });
});

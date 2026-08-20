import { describe, expect, test } from "vitest";

import {
  aspirationNameKeys,
  calculatePotential,
  createInitialPilot,
  factionNameKeys,
  getInitialStats,
  getLifeStage,
  normalizePilotName,
} from "../domain/pilot";
import {
  createBoundedValue,
  type Aspiration,
  type Faction,
} from "../domain/types";

const aspirations = Object.keys(aspirationNameKeys) as Aspiration[];
const factions = Object.keys(factionNameKeys) as Faction[];

describe("getInitialStats", () => {
  test.each(aspirations)("assigns 20 points to %s", (aspiration) => {
    const total = Object.values(getInitialStats(aspiration)).reduce(
      (sum, stat) => sum + stat,
      0,
    );

    expect(total).toBe(20);
  });

  test.each([
    ["commander", [5, 2, 3, 3, 4, 3]],
    ["shadow", [2, 4, 3, 3, 5, 3]],
    ["war-hero", [3, 5, 4, 2, 3, 3]],
    ["zoid-ace", [3, 3, 2, 5, 3, 4]],
  ] as const)("assigns the fixed profile to %s", (aspiration, expected) => {
    expect(Object.values(getInitialStats(aspiration))).toEqual(expected);
  });
});

describe("getLifeStage", () => {
  test.each([
    [12, "academy"],
    [14, "academy"],
    [15, "early-service"],
    [20, "early-service"],
    [21, "soldier-life"],
    [25, "soldier-life"],
    [26, "path-to-glory"],
    [34, "path-to-glory"],
    [35, "elite-command"],
    [44, "elite-command"],
    [45, "legacy"],
  ] as const)("maps age %s to %s", (age, stage) => {
    expect(getLifeStage(age)).toBe(stage);
  });
});

describe("createInitialPilot", () => {
  test.each(factions)("uses the same initial rules for %s", (faction) => {
    const pilot = createInitialPilot({
      aspiration: "zoid-ace",
      faction,
      id: "pilot:test",
      name: "  Lena\n\tSteel  ",
    });

    expect(pilot).toMatchObject({
      age: 12,
      basePotential: 0,
      career: {
        factionTrust: 0,
        fame: 0,
        militaryRank: "cadet",
        specialRank: null,
        warState: {
          intensity: "low",
          sides: [
            { control: 50, faction: "helic" },
            { control: 50, faction: "guylos" },
          ],
        },
      },
      condition: "active",
      faction,
      name: "Lena Steel",
      potential: 0,
      zoids: null,
    });
  });
});

describe("calculatePotential", () => {
  test("adds 25% of Zoid power without limiting pilot growth", () => {
    const pilot = createInitialPilot({
      aspiration: "zoid-ace",
      faction: "helic",
      id: "pilot:potential",
      name: "Lena",
    });
    const pilotWithZoid = {
      ...pilot,
      basePotential: createBoundedValue(80),
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:godos",
      },
    } as const;

    expect(calculatePotential(pilotWithZoid)).toBe(85);
    expect(
      calculatePotential({
        ...pilotWithZoid,
        basePotential: createBoundedValue(100),
      }),
    ).toBe(100);
  });
});

describe("normalizePilotName", () => {
  test("normalizes Unicode and whitespace", () => {
    expect(normalizePilotName("  Le\u0301na\u00a0Steel  ")).toBe("Léna Steel");
  });

  test("rejects an empty name", () => {
    expect(() => normalizePilotName(" \n\t ")).toThrow(TypeError);
  });
});

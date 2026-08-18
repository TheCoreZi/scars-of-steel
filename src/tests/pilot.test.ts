import { describe, expect, test } from "vitest";

import {
  aspirationNameKeys,
  createInitialPilot,
  factionNameKeys,
  getInitialStats,
  normalizePilotName,
} from "../domain/pilot";
import type { Aspiration, Faction } from "../domain/types";

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
      baseCombatPower: 0,
      career: {
        factionTrust: 0,
        fame: 0,
        militaryRank: "cadet",
        specialRank: null,
        warState: { guylos: 50, helic: 50 },
      },
      faction,
      name: "Lena Steel",
      zoids: null,
    });
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

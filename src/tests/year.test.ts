import { describe, expect, test, vi } from "vitest";

import { simulateBattleYear } from "../domain/battles";
import { eventCatalog } from "../domain/events";
import { applyOutcome } from "../domain/outcomes";
import { createInitialPilot } from "../domain/pilot";
import type { RandomGenerator } from "../domain/random";
import {
  createBoundedValue,
  createWarState,
  type Outcome,
  type Pilot,
} from "../domain/types";
import { advanceWarState, getWarBattleCount } from "../domain/war";
import { resolveYear } from "../domain/year";
import { getZoid } from "../domain/zoids";

const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:year",
  name: "Lena",
});

describe("year resolution", () => {
  test("applies a safe outcome atomically and assigns a signature Zoid", () => {
    const event = eventCatalog.firstExercises;
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createRandom(0),
    );

    expect(result.resolution.kind).toBe("safe");
    expect(result.pilotBefore).toBe(pilot);
    expect(result.pilotBefore.zoids).toBeNull();
    expect(result.pilotAfter.zoids?.signatureId).toBe(result.zoidIds[0]);
    expect(result.zoidIds).toHaveLength(1);
    expect(result.pilotAfter.zoids?.reserveIds).toEqual([]);
    expect(result.pilotAfter.stats.piloting).toBe(7);
    expect(result.pilotAfter.stats.synchrony).toBe(5);
    expect(result.pilotAfter.potential).toBe(
      Math.round(getZoid(result.zoidIds[0]).basePower * 0.25),
    );
    expect(result.battleRecord).toEqual({
      assigned: 0,
      available: 14,
      injured: false,
      killed: false,
      losses: 0,
      participated: 0,
      wins: 0,
      zoidDamaged: false,
      zoidDestroyed: false,
    });
    expect(result.changes).toEqual([
      { current: 7, previous: 5, stat: "piloting", target: "stat" },
      { current: 5, previous: 2, stat: "synchrony", target: "stat" },
      {
        current: 45,
        faction: "helic",
        previous: 50,
        target: "war-state",
      },
    ]);
  });

  test.each([
    [0.2, "success"],
    [0.8, "failure"],
  ] as const)("keeps a %s roll and its %s outcome", (probability, expected) => {
    const event = eventCatalog.firstExercises;
    const result = resolveYear(
      event.decisions[1],
      event,
      pilot,
      createRandom(probability),
    );

    expect(result.resolution).toMatchObject({
      kind: "chance",
      result: expected,
      roll: probability * 100,
    });
  });

  test("limits values, omits ineffective changes, and preserves existing Zoids", () => {
    const outcome = {
      id: "outcome:test-limits",
      narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
      statChanges: [
        { amount: -10, indicator: "fame", target: "career-indicator" },
        { amount: 200, stat: "piloting", target: "stat" },
      ],
      tags: [],
      zoidReward: "standard",
    } as const satisfies Outcome;
    const first = applyOutcome(pilot, outcome, "zoid:godos");
    const second = applyOutcome(first.pilotAfter, outcome, "zoid:guysack");

    expect(second.pilotAfter.career.fame).toBe(0);
    expect(second.pilotAfter.stats.piloting).toBe(100);
    expect(second.pilotAfter.zoids).toMatchObject({
      reserveIds: ["zoid:guysack"],
      signatureId: "zoid:godos",
    });
    expect(second.pilotAfter.potential).toBe(5);
    expect(second.changes).toEqual([]);
  });

  test.each([
    [eventCatalog.humanitarianMission, 0, "achievement:true-soldier"],
    [eventCatalog.mechanicsProgram, 0, "achievement:born-in-workshop"],
    [eventCatalog.veteranOffer, 1, "achievement:not-on-my-watch"],
  ] as const)("grants the applicable event achievement", (event, index, id) => {
    const result = resolveYear(
      event.decisions[index],
      event,
      pilot,
      createRandom(0),
    );

    expect(result.achievementIds).toContain(id);
  });

  test("applies an injury declared by the outcome", () => {
    const event = eventCatalog.humanitarianMission;
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createRandom(0.8),
    );

    expect(result.resolution).toMatchObject({ result: "failure" });
    expect(result.pilotAfter.condition).toBe("injured");
  });
});

describe("battle and war simulation", () => {
  test("simulates unassigned battles at equal odds", () => {
    const random = createRandom(0);
    const battles = getWarBattleCount(pilot.career.warState, random);
    const result = simulateBattleYear(
      pilot,
      battles,
      pilot.career.warState,
      random,
    );

    expect(battles).toBe(14);
    expect(result.record.participated).toBe(0);
    expect(result.secondFactionWins).toBe(14);
    expect(random.chance).toHaveBeenCalledTimes(14);
    expect(random.chance).toHaveBeenCalledWith(0.5);
  });

  test("resolves assigned battles with the pilot combat mechanism", () => {
    const random = createRandom(0);
    const result = simulateBattleYear(
      createCombatPilot(),
      2,
      pilot.career.warState,
      random,
    );

    expect(result.record).toMatchObject({
      assigned: 2,
      losses: 0,
      participated: 2,
      wins: 2,
    });
    expect(result.firstFactionWins).toBe(2);
    expect(result.secondFactionWins).toBe(0);
    expect(random.probability).toHaveBeenCalledTimes(5);
  });

  test("lets pilot potential improve performance with a weak Zoid", () => {
    const developedPilot = createCombatPilot();
    const developingPilot = {
      ...developedPilot,
      basePotential: createBoundedValue(0),
      potential: createBoundedValue(5),
    };

    expect(
      simulateBattleYear(
        developedPilot,
        1,
        pilot.career.warState,
        createRandom(0.28),
      ).record.wins,
    ).toBe(1);
    expect(
      simulateBattleYear(
        developingPilot,
        1,
        pilot.career.warState,
        createRandom(0.28),
      ).record.wins,
    ).toBe(0);
  });

  test("stops remaining participation when the pilot is injured and killed", () => {
    const result = simulateBattleYear(
      createCombatPilot(),
      2,
      pilot.career.warState,
      createRandom(0, [true, true, false, false]),
    );

    expect(result.record).toMatchObject({
      assigned: 2,
      injured: true,
      killed: true,
      participated: 1,
    });
    expect(result.pilot.condition).toBe("dead");
  });

  test("tracks Zoid damage and destruction", () => {
    const result = simulateBattleYear(
      createCombatPilot(),
      1,
      pilot.career.warState,
      createRandom(0, [false, true, true]),
    );

    expect(result.record).toMatchObject({
      zoidDamaged: true,
      zoidDestroyed: true,
    });
    expect(result.pilot.zoids).toBeNull();
  });

  test("uses the war intensity to set dynamic territorial movement", () => {
    const activeWar = createWarState("helic", 50, "guylos", 50, "active");
    const fierceWar = createWarState("helic", 50, "guylos", 50, "fierce");

    expect(advanceWarState(activeWar, 40, 0).change).toMatchObject({
      current: 70,
      previous: 50,
    });
    expect(advanceWarState(fierceWar, 40, 0).change).toMatchObject({
      current: 85,
      previous: 50,
    });
  });
});

function createCombatPilot(): Pilot {
  return {
    ...pilot,
    basePotential: createBoundedValue(100),
    career: {
      ...pilot.career,
      factionTrust: createBoundedValue(100),
      militaryRank: "general",
    },
    potential: createBoundedValue(100),
    zoids: {
      damagedIds: [],
      reserveIds: [],
      signatureId: "zoid:godos",
    },
  };
}

function createRandom(
  probability: number,
  chances: readonly boolean[] = [],
): RandomGenerator {
  let chanceIndex = 0;

  return {
    chance: vi.fn(() => chances[chanceIndex++] ?? false),
    integer: vi.fn((min) => min),
    probability: vi.fn(() => probability),
    weighted: vi.fn((entries) => entries[0].value),
  };
}

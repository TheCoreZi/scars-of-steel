import { describe, expect, test } from "vitest";

import {
  advanceCareerYear,
  createCareerHistory,
  getCareerEndReason,
  recordResolvedYear,
  resolveAnnualPromotion,
} from "../domain/career";
import { getEligibleEventIds, initialEventPool } from "../domain/eventPools";
import { eventCatalog } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import { createSeededRandomGenerator } from "../domain/random";
import { createWarState, type Outcome } from "../domain/types";
import { resolveYear } from "../domain/year";

const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:career-test",
  name: "Lena",
});
const outcome = {
  effects: [],
  id: "outcome:career-test",
  narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
} as const satisfies Outcome;

describe("career progression", () => {
  test("increments age without changing the source pilot", () => {
    expect(advanceCareerYear(pilot).age).toBe(13);
    expect(pilot.age).toBe(12);
  });

  test("promotes by rank eligibility and grants five faction trust", () => {
    const battleRecord = {
      assigned: 0,
      available: 0,
      injured: false,
      killed: false,
      losses: 0,
      participated: 0,
      wins: 0,
      zoidDamaged: false,
      zoidDestroyed: false,
    } as const;
    const random = createSeededRandomGenerator(1);
    const privatePilot = {
      ...pilot,
      age: 13,
      career: { ...pilot.career, militaryRank: "private" as const },
    };

    expect(resolveAnnualPromotion(pilot, battleRecord, random)).toBe(pilot);
    expect(
      resolveAnnualPromotion(privatePilot, battleRecord, {
        ...random,
        probability: () => 0,
      }).career,
    ).toMatchObject({ factionTrust: 5, militaryRank: "corporal" });
    expect(advanceCareerYear({ ...pilot, age: 14 }).career).toMatchObject({
      factionTrust: 5,
      militaryRank: "private",
    });
  });

  test("selects only unplayed events for the current age", () => {
    expect(getEligibleEventIds(pilot, [initialEventPool[0]])).toEqual(
      initialEventPool.slice(1),
    );
    const assignedPilot = {
      ...pilot,
      zoids: {
        damagedIds: [],
        reserveIds: [],
        signatureId: "zoid:godos" as const,
      },
    };
    expect(getEligibleEventIds({ ...assignedPilot, age: 13 }, [])).toHaveLength(
      32,
    );
    expect(getEligibleEventIds({ ...assignedPilot, age: 14 }, [])).toHaveLength(
      34,
    );
    expect(getEligibleEventIds({ ...assignedPilot, age: 15 }, [])).toHaveLength(
      8,
    );
  });

  test("accumulates battles, events, and unique achievements", () => {
    const event = eventCatalog.mechanicsProgram;
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createSeededRandomGenerator(1),
    );
    const first = recordResolvedYear(createCareerHistory(), event.id, result);
    const second = recordResolvedYear(first, event.id, result);

    expect(second.achievementIds).toEqual(["achievement:born-in-workshop"]);
    expect(second.completedEventIds).toEqual([event.id]);
    expect(second.battles.losses).toBe(result.battleRecord.losses * 2);
    expect(second.battles.participated).toBe(
      result.battleRecord.participated * 2,
    );
    expect(second.battles.wins).toBe(result.battleRecord.wins * 2);
  });

  test("ends when no eligible event remains", () => {
    expect(getCareerEndReason(pilot, [], outcome)).toBe("no-eligible-events");
  });

  test("prioritizes death and the final war state", () => {
    expect(
      getCareerEndReason(
        { ...pilot, condition: "dead" },
        initialEventPool,
        outcome,
      ),
    ).toBe("dead");
    expect(
      getCareerEndReason(
        {
          ...pilot,
          career: {
            ...pilot.career,
            warState: createWarState("helic", 100, "guylos", 0),
          },
        },
        initialEventPool,
        outcome,
      ),
    ).toBe("war-won");
    expect(
      getCareerEndReason(
        {
          ...pilot,
          career: {
            ...pilot.career,
            warState: createWarState("helic", 0, "guylos", 100),
          },
        },
        initialEventPool,
        outcome,
      ),
    ).toBe("war-lost");
  });

  test.each([
    ["disappeared", "disappeared"],
    ["non-operational", "non-operational"],
    ["retired", "retired"],
  ] as const)("uses %s as a terminal outcome", (effectReason, reason) => {
    expect(
      getCareerEndReason(pilot, initialEventPool, {
        ...outcome,
        effects: [{ kind: "end-career", reason: effectReason }],
      }),
    ).toBe(reason);
  });
});

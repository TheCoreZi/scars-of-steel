import { describe, expect, test } from "vitest";

import {
  advanceCareerYear,
  createCareerHistory,
  getCareerEndReason,
  recordResolvedYear,
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
  id: "outcome:career-test",
  narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
  statChanges: [],
  tags: [],
} as const satisfies Outcome;

describe("career progression", () => {
  test("increments age without changing the source pilot", () => {
    expect(advanceCareerYear(pilot).age).toBe(13);
    expect(pilot.age).toBe(12);
  });

  test("selects only unplayed events for the current age", () => {
    expect(getEligibleEventIds(12, [initialEventPool[0]])).toEqual(
      initialEventPool.slice(1),
    );
    expect(getEligibleEventIds(13, [])).toEqual([]);
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
    ["outcome-tag:disappeared", "disappeared"],
    ["outcome-tag:non-operational", "non-operational"],
    ["outcome-tag:retired", "retired"],
  ] as const)("uses %s as a terminal outcome", (tag, reason) => {
    expect(
      getCareerEndReason(pilot, initialEventPool, { ...outcome, tags: [tag] }),
    ).toBe(reason);
  });
});

import { afterEach, describe, expect, test } from "vitest";
import { loadGameData, saveGameData } from "../app/gameStorage";
import {
  calculateReviewSuccessChance,
  parseProbabilityWeights,
} from "../app/eventReviewProbability";
import { academyEvents } from "../domain/academyEvents";
import { getDeathChance } from "../domain/battles";
import {
  applyAnnualGrowth,
  recoveryChance,
  resolveAnnualRecovery,
} from "../domain/annualRecovery";
import {
  advanceCareerYear,
  createCareerHistory,
  getCareerEndReason,
  recordResolvedYear,
} from "../domain/career";
import { getEligibleEventIds, selectEvent } from "../domain/eventPools";
import {
  calculateAdjustedSuccessChance,
  eventCatalog,
  events,
  getEvent,
  getOutcome,
  outcomeCatalog,
  validateEvents,
} from "../domain/events";
import { applyOutcome, getModifiedGain } from "../domain/outcomes";
import { calculatePotential, createInitialPilot } from "../domain/pilot";
import {
  createSeededRandomGenerator,
  type RandomGenerator,
} from "../domain/random";
import {
  createBoundedValue,
  type Outcome,
  type Pilot,
  type StatName,
} from "../domain/types";
import { resolveYear } from "../domain/year";
import {
  academyRewardPools,
  zoidPools,
  selectRewardZoid,
} from "../domain/zoidPools";
import { getZoid, getEffectiveZoidPower } from "../domain/zoids";
import { i18n } from "../i18n";

const initial = createInitialPilot({
  aspiration: "commander",
  faction: "helic",
  id: "pilot:academy",
  name: "Academy Pilot",
});
const pilot: Pilot = {
  ...initial,
  age: 13,
  zoids: { signatureId: "zoid:godos", damagedIds: [], reserveIds: [] },
};
const harmless: Outcome = {
  effects: [],
  id: "outcome:test",
  narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
};
const storageKey = "scars-of-steel:game-data";

function randomWithRolls(...rolls: number[]): RandomGenerator {
  let index = 0;
  return {
    ...createSeededRandomGenerator(123),
    probability: () => rolls[index++] ?? 0.99,
  };
}

function randomSelecting<T>(selection: T): RandomGenerator {
  return {
    ...randomWithRolls(),
    weighted: <Value>(entries: readonly { value: Value }[]) =>
      entries.find(({ value }) => Object.is(value, selection))?.value ??
      entries[0].value,
  };
}

afterEach(() => window.localStorage.clear());

describe("academy catalog", () => {
  test("validates all events and their Spanish and English text", () => {
    expect(academyEvents).toHaveLength(34);
    expect(events).toHaveLength(49);
    expect(events.flatMap(({ decisions }) => decisions)).toHaveLength(147);
    expect(() => validateEvents(events)).not.toThrow();
    for (const event of events) {
      const keys: string[] = [event.titleKey, event.introductionKey];
      for (const decision of event.decisions) {
        keys.push(decision.labelKey, decision.descriptionKey);
        const outcomes =
          decision.kind === "safe"
            ? [getOutcome(decision.outcomeId)]
            : [
                getOutcome(decision.successOutcomeId),
                getOutcome(decision.failureOutcomeId),
              ];
        for (const outcome of outcomes) keys.push(outcome.narrativeKey);
      }
      for (const lng of ["es", "en"])
        for (const key of keys)
          expect(i18n.exists(key, { lng }), key).toBe(true);
    }
    expect(Object.keys(outcomeCatalog)).toHaveLength(
      events.reduce(
        (count, event) =>
          count +
          event.decisions.reduce(
            (total, decision) => total + (decision.kind === "chance" ? 2 : 1),
            0,
          ),
        0,
      ),
    );
  });

  test("filters age, completed events, and the signature Zoid requirement", () => {
    expect(getEligibleEventIds(pilot, [])).toHaveLength(32);
    expect(getEligibleEventIds({ ...pilot, age: 14 }, [])).toHaveLength(34);
    expect(getEligibleEventIds({ ...initial, age: 13 }, [])).toHaveLength(0);
    expect(getEligibleEventIds({ ...pilot, age: 15 }, [])).toHaveLength(8);
    expect(
      getEligibleEventIds({ ...pilot, age: 14 }, [academyEvents[0].id]),
    ).not.toContain(academyEvents[0].id);
  });

  test.each(["guylos", "helic"] as const)(
    "completes a three-year %s career and promotes to private",
    (faction) => {
      let current: Pilot = { ...initial, faction };
      let history = createCareerHistory();
      const random = createSeededRandomGenerator(5);
      for (const age of [12, 13, 14]) {
        expect(current.age).toBe(age);
        const event =
          age === 12
            ? eventCatalog.firstExercises
            : selectEvent(
                getEligibleEventIds(current, history.completedEventIds),
                random,
              );
        const decision =
          event.decisions.find((d) => d.kind === "safe") ?? event.decisions[1];
        const result = resolveYear(decision, event, current, random);
        expect(result.battleRecord.participated).toBe(0);
        expect(result.pilotAfter.career.militaryRank).toBe(
          age === 14 ? "private" : "cadet",
        );
        expect(result.annualReport?.promoted).toBe(age === 14);
        history = recordResolvedYear(history, event.id, result);
        current = advanceCareerYear(result.pilotAfter, result.outcome);
        expect(
          getCareerEndReason(
            current,
            getEligibleEventIds(current, history.completedEventIds),
            result.outcome,
          ),
        ).toBe(null);
      }
      expect(current.age).toBe(15);
      expect(current.career.militaryRank).toBe("private");
      expect(new Set(history.completedEventIds).size).toBe(3);
    },
  );

  test("suspends graduation without promoting a failed cadet", () => {
    const event = getEvent("event:academy-final-board");
    const result = resolveYear(
      event.decisions[0],
      event,
      { ...pilot, age: 14 },
      randomWithRolls(0.99),
    );
    const next = advanceCareerYear(result.pilotAfter, result.outcome);
    expect(next.career.militaryRank).toBe("cadet");
    expect(result.annualReport?.promoted).toBe(false);
    expect(getCareerEndReason(next, [], result.outcome)).toBe(
      "non-operational",
    );
  });

  test.each([0, 10, 30, 100])(
    "matches editor probability at %s, including Potential",
    (value) => {
      const weights = parseProbabilityWeights("piloting:0.3;potential:0.2");
      const stats = Object.fromEntries(
        Object.keys(pilot.stats).map((name) => [
          name,
          createBoundedValue(value),
        ]),
      ) as unknown as Pilot["stats"];
      const decision = {
        ...eventCatalog.firstExercises.decisions[1],
        baseSuccessChance: createBoundedValue(40),
        probabilityStats: [
          { stat: "piloting", weight: 0.3 },
          { stat: "potential", weight: 0.2 },
        ] as const,
      };
      expect(calculateAdjustedSuccessChance(decision, stats, value)).toBe(
        calculateReviewSuccessChance(40, weights, value),
      );
    },
  );
});

describe("growth, bonuses and recovery", () => {
  test("growth peaks at 25 and becomes uncommon at 37", () => {
    const stats = Object.fromEntries(
      Object.keys(pilot.stats).map((stat) => [stat, createBoundedValue(50)]),
    ) as Record<StatName, ReturnType<typeof createBoundedValue>>;
    const growth = (age: number, roll = 50) => {
      const subject = {
        ...pilot,
        age,
        stats,
        basePotential: createBoundedValue(50),
      };
      return (
        applyAnnualGrowth(subject, subject, {
          ...randomWithRolls(),
          integer: () => roll,
        }).pilotAfter.basePotential - 50
      );
    };
    expect(
      [12, 15, 20, 25, 30, 37, 40, 41, 50, 60, 100].map((age) => growth(age)),
    ).toEqual([2, 2, 3, 4, 2, 0, 0, -1, -2, -3, -3]);
    expect(growth(12, 0)).toBeGreaterThan(0);
    expect(
      Array.from({ length: 101 }, (_, roll) => growth(37, roll)).filter(
        (amount) => amount > 0,
      ).length,
    ).toBeLessThan(25);
  });

  test("stats improve development and delay decline without exceeding three points", () => {
    const growth = (age: number, stat: number, basePotential = 50) => {
      const subject = {
        ...pilot,
        age,
        basePotential: createBoundedValue(basePotential),
        stats: Object.fromEntries(
          Object.keys(pilot.stats).map((key) => [
            key,
            createBoundedValue(stat),
          ]),
        ) as Record<StatName, ReturnType<typeof createBoundedValue>>,
      };
      return (
        applyAnnualGrowth(subject, subject, {
          ...randomWithRolls(),
          integer: () => 50,
        }).pilotAfter.basePotential - basePotential
      );
    };
    expect(growth(25, 100)).toBeGreaterThan(growth(25, 0));
    expect(growth(50, 100)).toBeGreaterThan(growth(50, 0));
    expect(growth(100, 100)).toBe(-3);
    expect(growth(100, 0, 1)).toBe(-1);
    expect(growth(25, 100, 99)).toBe(1);
  });

  test("combines penalties and Organoid before one rounding step", () => {
    const both: Pilot = {
      ...pilot,
      condition: "injured",
      bonusIds: ["organoid"],
      zoids: { ...pilot.zoids!, damagedIds: ["zoid:godos"] },
    };
    expect(getModifiedGain(8, "strength", both)).toBe(3);
    expect(getModifiedGain(8, "piloting", both)).toBe(5);
    expect(getModifiedGain(8, "synchrony", both)).toBe(5);
    expect(getModifiedGain(8, "change-zoid-power", both)).toBe(5);
    expect(getModifiedGain(8, "change-potential", both)).toBe(3);
    expect(getModifiedGain(-8, "strength", both)).toBe(-8);
    expect(getModifiedGain(8, "change-career-indicator", both)).toBe(8);
    expect(getModifiedGain(1, "change-zoid-upgrades", both)).toBe(1);
    expect(getModifiedGain(1, "strength", both)).toBe(0);
  });

  test("records improvements on the owned Zoid without changing its catalog", () => {
    const before = getZoid("zoid:godos").basePower;
    const result = applyOutcome(
      { ...pilot, bonusIds: ["organoid"] },
      {
        ...harmless,
        effects: [
          { amount: 2, kind: "change-zoid-power" },
          { amount: 1, kind: "change-zoid-upgrades" },
          { bonusId: "organoid", kind: "grant-bonus" },
        ],
      },
      randomWithRolls(),
    );
    expect(getEffectiveZoidPower(result.pilotAfter, "zoid:godos")).toBe(
      Math.round((before + 3) * 1.15),
    );
    expect(result.pilotAfter.zoidProgress?.["zoid:godos"]?.upgrades).toBe(1);
    expect(result.pilotAfter.bonusIds).toEqual(["organoid"]);
    expect(getZoid("zoid:godos").basePower).toBe(before);
    expect(result.pilotAfter.potential).toBe(
      calculatePotential(result.pilotAfter),
    );
  });

  test("applies annual development and the start-of-year injury penalty", () => {
    const random = { ...randomWithRolls(), integer: () => 100 };
    const stats = Object.fromEntries(
      Object.keys(pilot.stats).map((stat) => [stat, 100]),
    ) as Record<StatName, ReturnType<typeof createBoundedValue>>;
    const developed = { ...pilot, stats };
    expect(
      applyAnnualGrowth(developed, developed, random).pilotAfter.basePotential,
    ).toBe(3);
    expect(
      applyAnnualGrowth(
        developed,
        { ...developed, condition: "injured" },
        random,
      ).pilotAfter.basePotential,
    ).toBe(1);
  });

  test("does not reduce gains for an injury first received in the same outcome", () => {
    const result = applyOutcome(
      pilot,
      {
        ...harmless,
        effects: [
          { amount: 4, kind: "change-stat", stat: "strength" },
          { kind: "injure-pilot" },
        ],
      },
      randomWithRolls(),
    );
    expect(result.pilotAfter.stats.strength - pilot.stats.strength).toBe(4);
    expect(result.pilotAfter.condition).toBe("injured");
  });

  test.each([
    [0, 20],
    [10, 23.84],
    [30, 35.48],
    [50, 50],
    [70, 64.52],
    [100, 80],
  ])("recovery at %s is %s percent", (value, chance) =>
    expect(recoveryChance(value)).toBeCloseTo(chance),
  );

  test("checks death once, then recovery, and retains conditions when rolls fail", () => {
    const injured: Pilot = {
      ...pilot,
      condition: "injured",
      zoids: { ...pilot.zoids!, damagedIds: ["zoid:godos"] },
    };
    const result = resolveAnnualRecovery(
      injured,
      randomWithRolls(0.99, 0.99, 0.99),
    );
    expect(result.rolls.map(({ kind }) => kind)).toEqual([
      "death",
      "recovery",
      "repair",
    ]);
    expect(result.pilot.condition).toBe("injured");
    expect(result.pilot.zoids?.damagedIds).toEqual(["zoid:godos"]);
    const healed = resolveAnnualRecovery(injured, randomWithRolls(0.99, 0, 0));
    expect(healed.pilot.condition).toBe("active");
    expect(healed.pilot.zoids?.damagedIds).toEqual([]);
    expect(healed.pilot.stats).toEqual(injured.stats);
    expect(
      resolveAnnualRecovery(injured, randomWithRolls(0)).pilot.condition,
    ).toBe("dead");
    expect(
      resolveAnnualRecovery(injured, randomWithRolls(0)).rolls,
    ).toHaveLength(1);
    expect(
      resolveAnnualRecovery(
        injured,
        randomWithRolls(0.99, 0.99),
        true,
      ).rolls.map(({ kind }) => kind),
    ).toEqual(["recovery", "repair"]);
  });

  test("accumulates wounds and repairs each damage independently", () => {
    const outcome: Outcome = {
      ...harmless,
      effects: [{ kind: "injure-pilot" }, { kind: "damage-signature-zoid" }],
    };
    const first = applyOutcome(pilot, outcome, randomWithRolls()).pilotAfter;
    const second = applyOutcome(first, outcome, randomWithRolls()).pilotAfter;
    expect(second.injuryCount).toBe(2);
    expect(second.zoids?.damagedIds).toEqual(["zoid:godos", "zoid:godos"]);
    saveGameData({
      activeGame: {
        eventId: "event:first-exercises",
        history: createCareerHistory(),
        phase: "choosing",
        pilot: second,
        screen: "event",
      },
      completedGames: [],
    });
    expect(loadGameData().activeGame).toMatchObject({ pilot: second });
    expect(getDeathChance(second)).toBeCloseTo(getDeathChance(first) * 2);
    expect(getDeathChance({ ...second, injuryCount: 1000 })).toBe(100);

    const partial = resolveAnnualRecovery(
      second,
      randomWithRolls(0.99, 0, 0.99, 0, 0.99),
    );
    expect(partial.rolls.map(({ kind }) => kind)).toEqual([
      "death",
      "recovery",
      "recovery",
      "repair",
      "repair",
    ]);
    expect(partial.pilot.injuryCount).toBe(1);
    expect(partial.pilot.condition).toBe("injured");
    expect(partial.pilot.zoids?.damagedIds).toEqual(["zoid:godos"]);
    const recovered = resolveAnnualRecovery(
      partial.pilot,
      randomWithRolls(0.99, 0, 0),
    );
    expect(recovered.pilot.injuryCount).toBe(0);
    expect(recovered.pilot.condition).toBe("active");
    expect(recovered.pilot.zoids?.damagedIds).toEqual([]);
  });

  test("Zoid repair favors synchrony, then technique, then power", () => {
    const damaged: Pilot = {
      ...pilot,
      zoids: { ...pilot.zoids!, damagedIds: ["zoid:godos"] },
      stats: {
        charisma: createBoundedValue(0),
        piloting: createBoundedValue(0),
        strength: createBoundedValue(0),
        synchrony: createBoundedValue(100),
        technique: createBoundedValue(0),
        tactics: createBoundedValue(0),
      },
      zoidProgress: {
        "zoid:godos": { power: createBoundedValue(0), upgrades: 0 },
      },
    };
    expect(
      resolveAnnualRecovery(damaged, randomWithRolls()).rolls[0].chance,
    ).toBe(50);
    const stronger = {
      ...damaged,
      zoidProgress: {
        "zoid:godos": { power: createBoundedValue(100), upgrades: 0 },
      },
    };
    expect(
      resolveAnnualRecovery(stronger, randomWithRolls()).rolls[0].chance,
    ).toBeCloseTo(recoveryChance(70));
  });
});

describe("rewards and saves", () => {
  test("stops effects after death or an explicit career ending", () => {
    const death = applyOutcome(
      pilot,
      {
        ...harmless,
        effects: [
          { kind: "kill-pilot" },
          { amount: 10, kind: "change-stat", stat: "strength" },
        ],
      },
      randomWithRolls(),
    );
    const ending = applyOutcome(
      pilot,
      {
        ...harmless,
        effects: [
          { kind: "end-career", reason: "retired" },
          { amount: 10, kind: "change-stat", stat: "strength" },
        ],
      },
      randomWithRolls(),
    );

    expect(death.pilotAfter.condition).toBe("dead");
    expect(death.pilotAfter.stats.strength).toBe(pilot.stats.strength);
    expect(ending.pilotAfter.stats.strength).toBe(pilot.stats.strength);
  });

  test("removes a Zoid and promotes the first reserve", () => {
    const withReserve: Pilot = {
      ...pilot,
      zoids: {
        ...pilot.zoids!,
        damagedIds: ["zoid:godos"],
        reserveIds: ["zoid:command-wolf"],
      },
    };
    const result = applyOutcome(
      withReserve,
      {
        ...harmless,
        effects: [{ kind: "remove-zoid", zoidId: "zoid:godos" }],
      },
      randomWithRolls(),
    );

    expect(result.pilotAfter.zoids).toEqual({
      damagedIds: [],
      reserveIds: [],
      signatureId: "zoid:command-wolf",
    });
  });

  test("uses nested category pools and faction-specific rewards", () => {
    for (const faction of ["guylos", "helic"] as const) {
      const random = {
        ...randomWithRolls(),
        weighted: <T>(entries: readonly { value: T }[]) => entries[0].value,
      };
      expect(selectRewardZoid("academy-replacement", faction, random).id).toBe(
        zoidPools[faction].weak[0].id,
      );
      for (const reward of ["herd", "aerial-academy"] as const) {
        expect(selectRewardZoid(reward, faction, random).id).toBe(
          academyRewardPools[reward][faction][0].id,
        );
        for (const { id } of academyRewardPools[reward][faction])
          expect(getZoid(id).faction).toBe(faction);
      }
    }
  });

  test("adds a reserve and explicitly replaces the signature with clean state", () => {
    const original: Pilot = {
      ...pilot,
      zoids: { ...pilot.zoids!, damagedIds: ["zoid:godos"] },
      zoidProgress: {
        "zoid:godos": { power: createBoundedValue(80), upgrades: 3 },
      },
    };
    const reserve = applyOutcome(
      original,
      {
        ...harmless,
        effects: [{ kind: "grant-zoid", poolId: "rare" }],
      },
      randomSelecting("zoid:command-wolf"),
    ).pilotAfter;
    expect(reserve.zoids?.signatureId).toBe("zoid:godos");
    expect(reserve.zoids?.reserveIds).toEqual(["zoid:command-wolf"]);
    const replaced = applyOutcome(
      reserve,
      {
        ...harmless,
        effects: [
          { kind: "replace-signature-zoid", poolId: "academy-replacement" },
        ],
      },
      randomSelecting("zoid:garius"),
    ).pilotAfter;
    expect(replaced.zoids?.signatureId).toBe("zoid:garius");
    expect(replaced.zoids?.damagedIds).toEqual([]);
    expect(replaced.zoidProgress?.["zoid:godos"]).toBeUndefined();
    expect(replaced.zoids?.reserveIds).toEqual(["zoid:command-wolf"]);
  });

  test("discards careers with unknown achievement IDs", () => {
    const legacy = { ...pilot, bonusIds: undefined, zoidProgress: undefined };
    const history = {
      ...createCareerHistory(),
      achievementIds: ["achievement:put-van-in-the-name"],
    };
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 2,
        activeGame: {
          screen: "event",
          phase: "choosing",
          eventId: "event:first-exercises",
          pilot: legacy,
          history,
        },
        completedGames: [
          {
            state: {
              screen: "final",
              pilot: legacy,
              history,
              endReason: "no-eligible-events",
              titleId: "title:false-promise",
              nicknameId: "nickname:guardian",
            },
          },
        ],
      }),
    );
    const restored = loadGameData();
    expect(restored).toEqual({ activeGame: null, completedGames: [] });
  });

  test("restores new outcomes with the exact annual rolls and bonuses", () => {
    const event = getEvent("event:academy-organoid-rumor");
    const result = resolveYear(
      event.decisions[1],
      event,
      { ...pilot, condition: "injured" },
      randomWithRolls(0, 0.99, 0.99),
    );
    const data = {
      activeGame: {
        screen: "event",
        phase: "outcome",
        eventId: event.id,
        history: createCareerHistory(),
        pilot: result.pilotAfter,
        result,
      },
      completedGames: [],
    } as const;
    saveGameData(data);
    expect(loadGameData()).toEqual(data);
  });

  test("discards resolved outcomes with obsolete fields", () => {
    const event = getEvent("event:academy-date-invitation");
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      randomWithRolls(0),
    );
    const legacyOutcome = {
      id: result.outcome.id,
      narrativeKey: result.outcome.narrativeKey,
      statChanges: [],
      tags: [],
    };
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeGame: {
          eventId: event.id,
          history: createCareerHistory(),
          phase: "outcome",
          pilot: result.pilotAfter,
          result: {
            ...result,
            achievementIds: ["achievement:put-van-in-the-name"],
            outcome: legacyOutcome,
          },
          screen: "event",
        },
        completedGames: [],
        version: 3,
      }),
    );

    const restored = loadGameData().activeGame;
    expect(restored).toBeNull();
  });
});

import { afterEach, describe, expect, test } from "vitest";

import { createEmptyGameData, loadGameData } from "../app/gameStorage";
import { createCareerHistory, resolveAnnualPromotion } from "../domain/career";
import { earlyServiceEvents } from "../domain/earlyServiceEvents";
import { getEligibleEventIds } from "../domain/eventPools";
import { getOutcome, validateEvents } from "../domain/events";
import { applyOutcome } from "../domain/outcomes";
import { createInitialPilot } from "../domain/pilot";
import { hasMinimumRank } from "../domain/ranks";
import {
  createSeededRandomGenerator,
  type RandomGenerator,
} from "../domain/random";
import {
  createBoundedValue,
  type BattleRecord,
  type CareerFlag,
  type MilitaryRank,
  type Pilot,
  type TranslationKey,
} from "../domain/types";
import { resolveYear } from "../domain/year";
import earlyServiceEn from "../locales/en/early-service.json";
import earlyServiceEs from "../locales/es/early-service.json";
import { i18n } from "../i18n";

const battleRecord = {
  assigned: 2,
  available: 8,
  injured: false,
  killed: false,
  losses: 1,
  participated: 2,
  wins: 1,
  zoidDamaged: false,
  zoidDestroyed: false,
} as const satisfies BattleRecord;
const initial = createInitialPilot({
  aspiration: "commander",
  faction: "helic",
  id: "pilot:early-service",
  name: "Early Service Pilot",
});
const pilot: Pilot = {
  ...initial,
  age: 15,
  career: {
    ...initial.career,
    factionTrust: createBoundedValue(30),
    fame: createBoundedValue(20),
    militaryRank: "private",
  },
  stats: Object.fromEntries(
    Object.keys(initial.stats).map((stat) => [stat, createBoundedValue(30)]),
  ) as unknown as Pilot["stats"],
  zoids: { damagedIds: [], reserveIds: [], signatureId: "zoid:godos" },
};
const storageKey = "scars-of-steel:game-data";

afterEach(() => window.localStorage.clear());

describe("early service catalog", () => {
  test("contains ten shared events and thirty translated decisions", () => {
    expect(earlyServiceEvents).toHaveLength(10);
    expect(
      earlyServiceEvents.flatMap(({ decisions }) => decisions),
    ).toHaveLength(30);
    expect(() => validateEvents(earlyServiceEvents)).not.toThrow();

    for (const event of earlyServiceEvents) {
      expect(event.ages).toEqual([15, 16, 17, 18, 19, 20]);
      expect(event.factions).toEqual(["guylos", "helic"]);
      const keys: TranslationKey[] = [event.introductionKey, event.titleKey];

      for (const decision of event.decisions) {
        keys.push(decision.descriptionKey, decision.labelKey);
        const outcomes =
          decision.kind === "safe"
            ? [getOutcome(decision.outcomeId)]
            : [
                getOutcome(decision.failureOutcomeId),
                getOutcome(decision.successOutcomeId),
              ];
        keys.push(...outcomes.map(({ narrativeKey }) => narrativeKey));
      }

      for (const language of ["en", "es"])
        for (const key of keys)
          expect(i18n.exists(key, { lng: language }), key).toBe(true);
    }
  });

  test("uses the approved decision types and base chances", () => {
    expect(
      earlyServiceEvents.map(({ decisions }) =>
        decisions.map((decision) =>
          decision.kind === "chance" ? decision.baseSuccessChance : "safe",
        ),
      ),
    ).toEqual([
      [30, "safe", 50],
      [50, 65, "safe"],
      [25, 55, "safe"],
      [60, "safe", 35],
      [55, 70, "safe"],
      [45, 25, "safe"],
      [30, 60, "safe"],
      [65, 40, "safe"],
      [50, "safe", 70],
      ["safe", 40, 60],
    ]);
  });

  test("filters hidden career flags and keeps six years available", () => {
    expect(getEligibleEventIds(pilot, [])).toHaveLength(8);
    expect(getEligibleEventIds({ ...pilot, zoids: null }, [])).toHaveLength(7);
    expect(
      getEligibleEventIds({ ...pilot, careerFlags: ["engineering"] }, []),
    ).toHaveLength(9);
    expect(
      getEligibleEventIds({ ...pilot, careerFlags: ["command"] }, []),
    ).toHaveLength(9);
    expect(
      getEligibleEventIds(
        { ...pilot, careerFlags: ["command", "engineering"] },
        [],
      ),
    ).toHaveLength(10);

    const ungated = earlyServiceEvents.filter(
      ({ requiredCareerFlags }) => !requiredCareerFlags,
    );
    expect(ungated).toHaveLength(8);
    expect(
      getEligibleEventIds({ ...pilot, careerFlags: ["rebel"] }, []),
    ).toHaveLength(8);
  });

  test("grants only the career flags specified by the approved catalog", () => {
    const grantingChoices = earlyServiceEvents
      .flatMap(({ decisions }) => decisions)
      .flatMap((decision) =>
        getDecisionOutcomes(decision).flatMap(({ effects }) =>
          effects
            .filter((effect) => effect.kind === "grant-career-flag")
            .map(({ careerFlag }) => [decision.id, careerFlag]),
        ),
      );

    expect(grantingChoices).toEqual([
      ["decision:early-service-barracks-duty-2", "engineering"],
      ["decision:early-service-red-river-2", "engineering"],
      ["decision:early-service-mount-olympus-3", "command"],
      ["decision:early-service-line-collapses-1", "rebel"],
      ["decision:early-service-impossible-part-1", "engineering"],
    ]);
  });

  test("stores flags once and keeps them out of visible changes", () => {
    const outcome = getOutcome("outcome:early-service-barracks-duty-2-success");
    const first = applyOutcome(pilot, outcome, createSeededRandomGenerator(1));
    const second = applyOutcome(
      first.pilotAfter,
      outcome,
      createSeededRandomGenerator(1),
    );

    expect(second.pilotAfter.careerFlags).toEqual(["engineering"]);
    expect(
      second.changes.every(({ target }) => target !== "career-indicator"),
    ).toBe(true);
  });

  test("stores the rebel flag after a successful disobedience", () => {
    const outcome = getOutcome(
      "outcome:early-service-line-collapses-1-success",
    );
    const result = applyOutcome(pilot, outcome, createSeededRandomGenerator(1));

    expect(result.pilotAfter.careerFlags).toEqual(["rebel"]);
  });

  test("grants promotions and a Zoid upgrade only in approved outcomes", () => {
    const outcomes = earlyServiceEvents.flatMap(({ decisions }) =>
      decisions.flatMap(getDecisionOutcomes),
    );
    const promotionIds = outcomes
      .filter(({ effects }) =>
        effects.some(({ kind }) => kind === "change-military-rank"),
      )
      .map(({ id }) => id);
    const upgradeIds = outcomes
      .filter(({ effects }) =>
        effects.some(({ kind }) => kind === "change-zoid-upgrades"),
      )
      .map(({ id }) => id);

    expect(promotionIds).toEqual([
      "outcome:early-service-mount-olympus-1-success",
      "outcome:early-service-enemy-informant-1-success",
      "outcome:early-service-line-collapses-2-success",
      "outcome:early-service-no-one-left-behind-1-success",
    ]);
    expect(upgradeIds).toEqual([
      "outcome:early-service-line-collapses-2-success",
    ]);
  });

  test("does not invent a replacement Zoid for the engineering event", () => {
    const outcome = getOutcome(
      "outcome:early-service-impossible-part-2-success",
    );
    const result = applyOutcome(
      { ...pilot, careerFlags: ["engineering"], zoids: null },
      outcome,
      createSeededRandomGenerator(1),
    );

    expect(result.pilotAfter.zoids).toBeNull();
  });

  test("runs every event at different points without sequence assumptions", () => {
    for (const [index, event] of earlyServiceEvents.entries()) {
      for (const age of [15, 20]) {
        const subject = {
          ...pilot,
          age,
          careerFlags: ["command", "engineering"] as CareerFlag[],
        };
        const decision = event.decisions[index % event.decisions.length];
        const outcome = getOutcome(
          decision.kind === "safe"
            ? decision.outcomeId
            : decision.successOutcomeId,
        );
        expect(
          applyOutcome(subject, outcome, createSeededRandomGenerator(index))
            .pilotAfter.age,
        ).toBe(age);
      }
    }
  });

  test("keeps Red River and Mount Olympus outcomes local", () => {
    const redRiver = earlyServiceEvents[1];
    const redRiverOutcomes = redRiver.decisions.flatMap(getDecisionOutcomes);
    const translateOutcome = i18n.getFixedT("es", "outcomes");
    const redRiverText = redRiverOutcomes
      .map(({ narrativeKey }) =>
        translateOutcome(narrativeKey.replace("outcomes:", "") as never),
      )
      .join(" ");
    expect(redRiverText).toMatch(/Puente de Fuego/);
    expect(redRiverText).toMatch(/dos ejércitos/);
    expect(redRiver.decisions[2].kind).toBe("safe");

    const mountOlympus = earlyServiceEvents[2];
    expect(mountOlympus.decisions).toHaveLength(3);
    for (const decision of mountOlympus.decisions)
      expect(getDecisionOutcomes(decision)).not.toHaveLength(0);
  });

  test("does not use sequence-dependent phrases", () => {
    const text = JSON.stringify([earlyServiceEn, earlyServiceEs]);
    expect(text).not.toMatch(
      /primera batalla|última misión|por fin|de nuevo|first battle|last mission|finally|again/iu,
    );
    expect(text).not.toMatch(/\bsoldado\b|\bsoldier\b/iu);
  });
});

describe("early service progression", () => {
  test("allows only one promotion when an outcome grants a rank", () => {
    const event = earlyServiceEvents[2];
    const result = resolveYear(
      event.decisions[0],
      event,
      pilot,
      createPredictableRandom(),
    );

    expect(result.pilotAfter.career.militaryRank).toBe("corporal");
    expect(result.pilotAfter.career.factionTrust).toBe(37);
    expect(result.annualReport?.promoted).toBe(true);
  });

  test("blocks the annual promotion after a failed chance decision", () => {
    const event = earlyServiceEvents[0];
    let roll = 0;
    const random = createPredictableRandom();
    random.probability = () => (roll++ === 0 ? 0.99 : 0);
    const result = resolveYear(
      event.decisions[0],
      event,
      {
        ...pilot,
        stats: Object.fromEntries(
          Object.keys(pilot.stats).map((stat) => [
            stat,
            createBoundedValue(100),
          ]),
        ) as unknown as Pilot["stats"],
      },
      random,
    );

    expect(result.resolution).toMatchObject({ result: "failure" });
    expect(result.pilotAfter.career.militaryRank).toBe("private");
    expect(result.annualReport?.promoted).toBe(false);
  });

  test("usually ends a competent six-year service as corporal or sergeant", () => {
    const ranks = Array.from({ length: 1_000 }, (_, seed) =>
      simulatePromotions(pilot, seed),
    );
    const typical = ranks.filter(
      (rank) => rank === "corporal" || rank === "sergeant",
    ).length;
    const officers = ranks.filter((rank) =>
      hasMinimumRank(rank, "lieutenant"),
    ).length;

    expect(typical).toBeGreaterThan(700);
    expect(officers).toBeLessThan(200);
  });

  test("discards stored data without career flags", () => {
    const invalidPilot: Record<string, unknown> = { ...initial };
    delete invalidPilot.careerFlags;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        activeGame: {
          eventId: "event:first-exercises",
          history: createCareerHistory(),
          phase: "choosing",
          pilot: invalidPilot,
          screen: "event",
        },
        completedGames: [],
      }),
    );

    expect(loadGameData()).toEqual(createEmptyGameData());
  });
});

function getDecisionOutcomes(
  decision: (typeof earlyServiceEvents)[number]["decisions"][number],
) {
  return decision.kind === "safe"
    ? [getOutcome(decision.outcomeId)]
    : [
        getOutcome(decision.failureOutcomeId),
        getOutcome(decision.successOutcomeId),
      ];
}

function createPredictableRandom(): RandomGenerator {
  return {
    chance: () => false,
    integer: (minimum) => minimum,
    probability: () => 0,
    weighted: (entries) => entries[0].value,
  };
}

function simulatePromotions(subject: Pilot, seed: number): MilitaryRank {
  const random = createSeededRandomGenerator(seed);
  let current = subject;
  for (let age = 15; age <= 20; age += 1) {
    current = resolveAnnualPromotion({ ...current, age }, battleRecord, random);
  }
  return current.career.militaryRank;
}

import { describe, expect, test, vi } from "vitest";

import {
  calculateAdjustedSuccessChance,
  eventCatalog,
  resolveDecision,
  validateEvents,
} from "../domain/events";
import { initialEventPool, selectInitialEvent } from "../domain/eventPools";
import { getEvent } from "../domain/events";
import { createInitialPilot } from "../domain/pilot";
import type { RandomGenerator } from "../domain/random";
import {
  createBoundedValue,
  type ChanceDecision,
  type DecisionEvent,
  type Outcome,
  type SafeDecision,
  type StatChange,
  type Stats,
} from "../domain/types";
import { translate } from "../i18n";

const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:event-test",
  name: "Lena",
});
const initialEvents = initialEventPool.map(getEvent);

const testOutcome = {
  id: "outcome:test",
  narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
  statChanges: [
    { amount: 1, stat: "piloting", target: "stat" },
    { amount: 1, stat: "synchrony", target: "stat" },
  ],
  tags: [],
  zoidReward: "standard",
} as const satisfies Outcome;

function createChanceDecision(baseSuccessChance: number): ChanceDecision {
  return {
    baseSuccessChance: createBoundedValue(baseSuccessChance),
    descriptionKey: "decisions:academy.firstExercises.controlRare.description",
    failureOutcome: testOutcome,
    id: "decision:test",
    kind: "chance",
    labelKey: "decisions:academy.firstExercises.controlRare.label",
    probabilityStats: [
      { stat: "piloting", weight: 0.3 },
      { stat: "synchrony", weight: 0.15 },
    ],
    successOutcome: testOutcome,
  };
}

function createStats(piloting: number, synchrony: number): Stats {
  const zero = createBoundedValue(0);

  return {
    charisma: zero,
    piloting: createBoundedValue(piloting),
    strength: zero,
    synchrony: createBoundedValue(synchrony),
    tactics: zero,
    technique: zero,
  };
}

function createRandom(probability: number): RandomGenerator {
  return {
    chance: vi.fn(),
    integer: vi.fn(() => 4),
    probability: vi.fn(() => probability),
    weighted: <T>(entries: readonly { value: T }[]) => entries[0].value,
  };
}

function createValidationEvent(
  statChanges: readonly StatChange[],
): DecisionEvent {
  const createDecision = (index: number): SafeDecision => ({
    descriptionKey:
      "decisions:academy.firstExercises.acceptStandard.description",
    id: `decision:validation-${index}`,
    kind: "safe",
    labelKey: "decisions:academy.firstExercises.acceptStandard.label",
    outcome: {
      id: `outcome:validation-${index}`,
      narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
      statChanges,
      tags: [],
      zoidReward: "standard",
    },
  });

  return {
    decisions: [createDecision(1), createDecision(2), createDecision(3)],
    id: "event:validation",
    introductionKey: "narrative:academy.firstExercises.introduction",
    titleKey: "narrative:academy.firstExercises.title",
  };
}

describe("Initial event content", () => {
  test("defines five events, 15 decisions, and 21 outcomes", () => {
    const events: readonly DecisionEvent[] = Object.values(eventCatalog);
    const decisions = events.flatMap((event) => event.decisions);
    const outcomes = decisions.flatMap((decision) =>
      decision.kind === "safe"
        ? [decision.outcome]
        : [decision.successOutcome, decision.failureOutcome],
    );

    expect(initialEventPool).toHaveLength(5);
    expect(decisions).toHaveLength(15);
    expect(outcomes).toHaveLength(21);
    expect(new Set(outcomes.map((outcome) => outcome.id)).size).toBe(21);
  });

  test("rejects duplicate event identifiers", () => {
    expect(() => validateEvents([initialEvents[0], initialEvents[0]])).toThrow(
      "Duplicate event identifier",
    );
  });

  test("requires at least one change in every outcome", () => {
    expect(() =>
      validateEvents([
        createValidationEvent([
          { amount: 1, stat: "piloting", target: "stat" },
        ]),
      ]),
    ).not.toThrow();
    expect(() => validateEvents([createValidationEvent([])])).toThrow(
      "must include at least one change",
    );
  });

  test("selects an event through the injected random generator", () => {
    const random = createRandom(0);

    expect(selectInitialEvent(random)).toBe(initialEvents[4]);
    expect(random.integer).toHaveBeenCalledWith(0, 4);
  });

  test("provides translations for every event, decision, and outcome", () => {
    for (const event of initialEvents) {
      expect(translate(event.introductionKey)).toBeTruthy();
      expect(translate(event.titleKey)).toBeTruthy();

      for (const decision of event.decisions) {
        expect(translate(decision.descriptionKey)).toBeTruthy();
        expect(translate(decision.labelKey)).toBeTruthy();

        const outcomes =
          decision.kind === "safe"
            ? [decision.outcome]
            : [decision.successOutcome, decision.failureOutcome];

        for (const result of outcomes) {
          expect(translate(result.narrativeKey)).toBeTruthy();
        }
      }
    }
  });
});

describe("adjusted event probability", () => {
  test("uses the stat weights declared by the decision", () => {
    const decision = {
      ...createChanceDecision(40),
      probabilityStats: [{ stat: "piloting", weight: 0.1 }],
    } as const satisfies ChanceDecision;

    expect(calculateAdjustedSuccessChance(decision, createStats(5, 0))).toBe(
      44,
    );
  });

  test.each([
    [0, 0, 40],
    [1, 0, 45],
    [5, 0, 52],
    [5, 5, 58],
  ])(
    "uses piloting %s and synchrony %s to produce %s percent",
    (piloting, synchrony, expected) => {
      expect(
        calculateAdjustedSuccessChance(
          createChanceDecision(40),
          createStats(piloting, synchrony),
        ),
      ).toBe(expected);
    },
  );

  test("limits adjusted probability to 5 and 95 percent", () => {
    expect(
      calculateAdjustedSuccessChance(
        createChanceDecision(0),
        createStats(0, 0),
      ),
    ).toBe(5);
    expect(
      calculateAdjustedSuccessChance(
        createChanceDecision(100),
        createStats(100, 100),
      ),
    ).toBe(95);
  });
});

describe("decision resolution", () => {
  test("does not consume randomness for a safe decision", () => {
    const random = createRandom(0);
    const decision = eventCatalog.firstExercises.decisions[0];

    expect(resolveDecision(decision, pilot, random)).toEqual({
      decisionId: decision.id,
      kind: "safe",
      outcomeId: decision.outcome.id,
    });
    expect(random.probability).not.toHaveBeenCalled();
  });

  test.each([
    [0.55, "success"],
    [0.56, "failure"],
  ] as const)("uses the visible threshold for a %s roll", (roll, result) => {
    const random = createRandom(roll);
    const decision = eventCatalog.firstExercises.decisions[1];
    const resolution = resolveDecision(decision, pilot, random);

    expect(resolution).toMatchObject({
      adjustedSuccessChance: 56,
      result,
      roll: roll * 100,
    });
  });
});

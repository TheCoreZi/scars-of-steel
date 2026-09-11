import { describe, expect, test, vi } from "vitest";

import {
  calculateAdjustedSuccessChance,
  eventCatalog,
  getEvent,
  getOutcome,
  resolveDecision,
  validateEvents,
  validateOutcomes,
} from "../domain/events";
import { initialEventPool, selectInitialEvent } from "../domain/eventPools";
import { createInitialPilot } from "../domain/pilot";
import type { RandomGenerator } from "../domain/random";
import {
  createBoundedValue,
  type ChanceDecision,
  type DecisionEvent,
  type Outcome,
  type SafeDecision,
  type Stats,
} from "../domain/types";
import { i18n, supportedLanguages } from "../i18n";

const pilot = createInitialPilot({
  aspiration: "war-hero",
  faction: "helic",
  id: "pilot:event-test",
  name: "Lena",
});
const initialEvents = initialEventPool.map(getEvent);
const validationOutcomeIds = [
  eventCatalog.firstExercises.decisions[0].outcomeId,
  eventCatalog.firstExercises.decisions[2].outcomeId,
  eventCatalog.mechanicsProgram.decisions[0].outcomeId,
] as const;

const testOutcome = {
  effects: [
    { amount: 1, kind: "change-stat", stat: "piloting" },
    { amount: 1, kind: "change-stat", stat: "synchrony" },
    { kind: "grant-zoid", poolId: "standard" },
  ],
  id: "outcome:test",
  narrativeKey: "outcomes:academy.firstExercisesAcceptStandard",
} as const satisfies Outcome;

function createChanceDecision(baseSuccessChance: number): ChanceDecision {
  return {
    baseSuccessChance: createBoundedValue(baseSuccessChance),
    descriptionKey: "decisions:academy.firstExercises.controlRare.description",
    failureOutcomeId: testOutcome.id,
    id: "decision:test",
    kind: "chance",
    labelKey: "decisions:academy.firstExercises.controlRare.label",
    probabilityStats: [
      { stat: "piloting", weight: 0.3 },
      { stat: "synchrony", weight: 0.15 },
    ],
    successOutcomeId: testOutcome.id,
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

function createRandom(probability: number, integer = 4): RandomGenerator {
  return {
    chance: vi.fn(),
    integer: vi.fn(() => integer),
    probability: vi.fn(() => probability),
    weighted: <T>(entries: readonly { value: T }[]) => entries[0].value,
  };
}

function createValidationEvent() {
  const createDecision = (index: number): SafeDecision => ({
    descriptionKey:
      "decisions:academy.firstExercises.acceptStandard.description",
    id: `decision:validation-${index}`,
    kind: "safe",
    labelKey: "decisions:academy.firstExercises.acceptStandard.label",
    outcomeId: validationOutcomeIds[index - 1],
  });

  return {
    decisions: [createDecision(1), createDecision(2), createDecision(3)],
    id: "event:validation",
    introductionKey: "narrative:academy.firstExercises.introduction",
    titleKey: "narrative:academy.firstExercises.title",
  } as const satisfies DecisionEvent;
}

function createValidationChanceEvent(
  changes: Partial<ChanceDecision> = {},
): DecisionEvent {
  const event = createValidationEvent();
  const decision = {
    ...createChanceDecision(40),
    failureOutcomeId: eventCatalog.firstExercises.decisions[1].failureOutcomeId,
    id: "decision:validation-chance",
    successOutcomeId: eventCatalog.firstExercises.decisions[1].successOutcomeId,
    ...changes,
  } as ChanceDecision;

  return {
    ...event,
    decisions: [decision, event.decisions[1], event.decisions[2]],
  };
}

describe("Initial event content", () => {
  test("defines a valid catalog with connected references", () => {
    const events: readonly DecisionEvent[] = Object.values(eventCatalog);

    expect(() => validateEvents(events)).not.toThrow();
    expect(new Set(initialEventPool).size).toBe(initialEventPool.length);

    for (const event of events) {
      expect(getEvent(event.id)).toBe(event);

      for (const decision of event.decisions) {
        const outcomes =
          decision.kind === "safe"
            ? [getOutcome(decision.outcomeId)]
            : [
                getOutcome(decision.successOutcomeId),
                getOutcome(decision.failureOutcomeId),
              ];

        for (const outcome of outcomes) {
          expect(getOutcome(outcome.id)).toBe(outcome);
        }
      }
    }

    for (const eventId of initialEventPool) {
      expect(getEvent(eventId).id).toBe(eventId);
    }
  });

  test("rejects duplicate event identifiers", () => {
    expect(() => validateEvents([initialEvents[0], initialEvents[0]])).toThrow(
      "Duplicate event identifier",
    );
  });

  test("requires three decisions with unique identifiers", () => {
    const event = createValidationEvent();

    expect(() =>
      validateEvents([
        {
          ...event,
          decisions: event.decisions.slice(0, 2),
        } as unknown as DecisionEvent,
      ]),
    ).toThrow("must have three decisions");
    expect(() =>
      validateEvents([
        {
          ...event,
          decisions: [
            event.decisions[0],
            event.decisions[0],
            event.decisions[2],
          ],
        },
      ]),
    ).toThrow("Duplicate decision identifier");
  });

  test("requires at least one effect in every outcome", () => {
    expect(() =>
      validateOutcomes({ [testOutcome.id]: testOutcome }),
    ).not.toThrow();
    expect(() =>
      validateOutcomes({
        "outcome:empty": {
          effects: [],
          id: "outcome:empty",
          narrativeKey: testOutcome.narrativeKey,
        },
      }),
    ).toThrow("must include at least one effect");
  });

  test.each([0, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid outcome change %s",
    (amount) => {
      expect(() =>
        validateOutcomes({
          "outcome:invalid": {
            effects: [{ amount, kind: "change-stat", stat: "piloting" }],
            id: "outcome:invalid",
            narrativeKey: testOutcome.narrativeKey,
          },
        }),
      ).toThrow("has an invalid effect amount");
    },
  );

  test("requires an available Zoid pool for each outcome reward", () => {
    const outcome = {
      ...testOutcome,
      effects: [{ kind: "grant-zoid", poolId: "missing" }],
    } as unknown as Outcome;

    expect(() => validateOutcomes({ [outcome.id]: outcome })).toThrow(
      "uses an unavailable Zoid pool",
    );
  });

  test("requires unique probability stats with positive finite weights", () => {
    expect(() =>
      validateEvents([
        createValidationChanceEvent({
          probabilityStats: [
            { stat: "piloting", weight: 0.3 },
            { stat: "piloting", weight: 0.15 },
          ],
        }),
      ]),
    ).toThrow("repeats a probability stat");

    for (const weight of [0, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() =>
        validateEvents([
          createValidationChanceEvent({
            probabilityStats: [{ stat: "piloting", weight }],
          }),
        ]),
      ).toThrow("has an invalid stat weight");
    }
  });

  test.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid base probability %s",
    (baseSuccessChance) => {
      expect(() =>
        validateEvents([
          createValidationChanceEvent({
            baseSuccessChance: baseSuccessChance as never,
          }),
        ]),
      ).toThrow("has an invalid probability");
    },
  );

  test.each([-1, 101, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects the invalid neutral stat %s",
    (probabilityNeutralStat) => {
      expect(() =>
        validateEvents([
          createValidationChanceEvent({
            probabilityNeutralStat: probabilityNeutralStat as never,
          }),
        ]),
      ).toThrow("has an invalid neutral stat");
    },
  );

  test("selects an event through the injected random generator", () => {
    const index = initialEventPool.length - 1;
    const random = createRandom(0, index);

    expect(selectInitialEvent(random)).toBe(initialEvents[index]);
    expect(random.integer).toHaveBeenCalledWith(0, index);
  });

  test("provides every content translation in each language", () => {
    for (const event of Object.values(eventCatalog)) {
      for (const language of supportedLanguages) {
        expect(i18n.exists(event.introductionKey, { lng: language })).toBe(
          true,
        );
        expect(i18n.exists(event.titleKey, { lng: language })).toBe(true);
      }

      for (const decision of event.decisions) {
        for (const language of supportedLanguages) {
          expect(i18n.exists(decision.descriptionKey, { lng: language })).toBe(
            true,
          );
          expect(i18n.exists(decision.labelKey, { lng: language })).toBe(true);
        }

        const outcomes =
          decision.kind === "safe"
            ? [getOutcome(decision.outcomeId)]
            : [
                getOutcome(decision.successOutcomeId),
                getOutcome(decision.failureOutcomeId),
              ];

        for (const result of outcomes) {
          for (const language of supportedLanguages) {
            expect(i18n.exists(result.narrativeKey, { lng: language })).toBe(
              true,
            );
          }
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
      41,
    );
  });

  test.each([
    [0, 0, 35],
    [1, 0, 36],
    [5, 0, 42],
    [5, 5, 46],
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

  test("subtracts five points when both relevant stats are zero", () => {
    expect(
      calculateAdjustedSuccessChance(
        createChanceDecision(60),
        createStats(0, 0),
      ),
    ).toBe(55);
  });

  test("adds six points when both relevant stats are five", () => {
    expect(
      calculateAdjustedSuccessChance(
        createChanceDecision(60),
        createStats(5, 5),
      ),
    ).toBe(66);
  });

  test.each([
    [0.3, 0, 57],
    [0.3, 5, 64],
    [0.8, 0, 51],
    [0.8, 5, 71],
    [1.6, 0, 42],
    [1.6, 5, 82],
  ])(
    "uses factor %s for stat %s to produce %s percent",
    (weight, stat, expected) => {
      const decision = {
        ...createChanceDecision(60),
        probabilityStats: [{ stat: "piloting", weight }],
      } as const satisfies ChanceDecision;

      expect(
        calculateAdjustedSuccessChance(decision, createStats(stat, 0)),
      ).toBe(expected);
    },
  );

  test("uses diminishing returns through stat 100", () => {
    const decision = createChanceDecision(40);
    const atFive = calculateAdjustedSuccessChance(decision, createStats(5, 5));
    const atOneHundred = calculateAdjustedSuccessChance(
      decision,
      createStats(100, 100),
    );

    expect(atFive).toBe(46);
    expect(atOneHundred).toBe(76);
  });

  test("uses the neutral stat configured by the decision", () => {
    const decision = {
      ...createChanceDecision(60),
      probabilityNeutralStat: createBoundedValue(5),
    } as const satisfies ChanceDecision;

    expect(calculateAdjustedSuccessChance(decision, createStats(5, 5))).toBe(
      60,
    );
    expect(calculateAdjustedSuccessChance(decision, createStats(2, 2))).toBe(
      54,
    );
  });

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
      outcomeId: decision.outcomeId,
    });
    expect(random.probability).not.toHaveBeenCalled();
  });

  test.each([
    [0.43, "success"],
    [0.44, "failure"],
  ] as const)("uses the visible threshold for a %s roll", (roll, result) => {
    const random = createRandom(roll);
    const decision = eventCatalog.firstExercises.decisions[1];
    const resolution = resolveDecision(decision, pilot, random);

    expect(resolution).toMatchObject({
      adjustedSuccessChance: 44,
      result,
      roll: roll * 100,
    });
  });
});

import { describe, expect, expectTypeOf, test } from "vitest";

import {
  createBoundedValue,
  createWarState,
  type ChanceDecision,
  type Decision,
  type GameState,
  type Outcome,
  type PilotWithoutZoid,
  type SafeDecision,
  type Stats,
} from "../domain/types";

const zero = createBoundedValue(0);

const outcome = {
  id: "outcome:standard-zoid",
  narrativeKey: "outcomes:academy.standardZoid",
  statChanges: [],
  tags: [],
  zoidReward: "standard",
} as const satisfies Outcome;

const safeDecision = {
  descriptionKey: "decisions:academy.acceptStandard.description",
  id: "decision:accept-standard",
  kind: "safe",
  labelKey: "decisions:academy.acceptStandard.label",
  outcome,
} as const satisfies SafeDecision;

const chanceDecision = {
  baseSuccessChance: createBoundedValue(40),
  descriptionKey: "decisions:academy.controlRare.description",
  failureOutcome: outcome,
  id: "decision:control-rare",
  kind: "chance",
  labelKey: "decisions:academy.controlRare.label",
  probabilityStats: [
    { stat: "piloting", weight: 0.3 },
    { stat: "synchrony", weight: 0.15 },
  ],
  successOutcome: outcome,
} as const satisfies ChanceDecision;

const stats = {
  charisma: zero,
  piloting: zero,
  strength: zero,
  synchrony: zero,
  tactics: zero,
  technique: zero,
} satisfies Stats;

const pilotWithoutZoid = {
  age: 12,
  aspiration: "zoid-ace",
  basePotential: zero,
  career: {
    factionTrust: zero,
    fame: zero,
    militaryRank: "cadet",
    specialRank: null,
    warState: createWarState("helic", 50, "guylos", 50),
  },
  condition: "active",
  faction: "helic",
  id: "pilot:test",
  name: "Test Pilot",
  potential: zero,
  stats,
  zoids: null,
} as const satisfies PilotWithoutZoid;

describe("createBoundedValue", () => {
  test.each([0, 100])("accepts the boundary value %s", (value) => {
    expect(createBoundedValue(value)).toBe(value);
  });

  test.each([-1, 101, Number.NaN, Number.NEGATIVE_INFINITY, Infinity])(
    "rejects the invalid value %s",
    (value) => {
      expect(() => createBoundedValue(value)).toThrow(RangeError);
    },
  );
});

describe("createWarState", () => {
  test("accepts faction control values that total 100", () => {
    expect(createWarState("helic", 50, "guylos", 50)).toMatchObject({
      intensity: "low",
      sides: [
        { control: 50, faction: "helic" },
        { control: 50, faction: "guylos" },
      ],
    });
  });

  test.each([
    [-1, 101],
    [40, 40],
    [50, Number.NaN],
  ])("rejects the invalid control values %s and %s", (helic, guylos) => {
    expect(() => createWarState("helic", helic, "guylos", guylos)).toThrow(
      RangeError,
    );
  });

  test("rejects a war with the same faction on both sides", () => {
    expect(() => createWarState("helic", 50, "helic", 50)).toThrow(RangeError);
  });
});

test("defines valid decision contracts", () => {
  expectTypeOf(safeDecision).toMatchTypeOf<Decision>();
  expectTypeOf(chanceDecision).toMatchTypeOf<Decision>();
});

const incompleteStats: Omit<Stats, "tactics"> = {
  charisma: zero,
  piloting: zero,
  strength: zero,
  synchrony: zero,
  technique: zero,
};

// @ts-expect-error All six pilot stats are required.
const invalidStats: Stats = incompleteStats;

// @ts-expect-error Safe decisions cannot define a success chance.
const invalidSafeDecision: Decision = {
  ...safeDecision,
  baseSuccessChance: createBoundedValue(100),
};

// @ts-expect-error Chance decisions require success and failure outcomes.
const invalidChanceDecision: Decision = {
  baseSuccessChance: createBoundedValue(40),
  descriptionKey: "decisions:academy.invalid.description",
  id: "decision:invalid-chance",
  kind: "chance",
  labelKey: "decisions:academy.invalid.label",
  probabilityStats: [{ stat: "piloting", weight: 0.3 }],
};

const choosingState = {
  eventId: "event:first-exercises",
  phase: "choosing",
  pilot: pilotWithoutZoid,
  screen: "event",
} as const satisfies GameState;

// @ts-expect-error Animating an event requires a stored result.
const invalidAnimatingState: GameState = {
  ...choosingState,
  phase: "animating",
};

const invalidFinalState: GameState = {
  achievementIds: [],
  eventId: "event:first-exercises",
  nicknameKey: "nicknames:default.guardian",
  // @ts-expect-error The final screen requires a pilot with a signature Zoid.
  pilot: pilotWithoutZoid,
  resolution: {
    decisionId: "decision:accept-standard",
    kind: "safe",
    outcomeId: "outcome:standard-zoid",
  },
  screen: "final",
  titleKey: "titles:villageHero",
};

void invalidChanceDecision;
void invalidFinalState;
void invalidAnimatingState;
void invalidSafeDecision;
void invalidStats;

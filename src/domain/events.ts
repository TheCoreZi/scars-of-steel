import { createDecisionEventFactory } from "./eventDefinitions";
import type { RandomGenerator } from "./random";
import {
  createBoundedValue,
  type ChanceDecision,
  type Decision,
  type DecisionEvent,
  type DecisionResolution,
  type EventId,
  type Outcome,
  type OutcomeId,
  type Pilot,
  type Stats,
} from "./types";
import { isZoidRewardPoolAvailable } from "./zoidPools";
import { academyEvents } from "./academyEvents";
import { initialOutcomeCatalog } from "./initialOutcomes";
import { academyOutcomeCatalog } from "./academyOutcomes";
import { earlyServiceEvents } from "./earlyServiceEvents";
import { earlyServiceOutcomeCatalog } from "./earlyServiceOutcomes";
import { calculateSuccessChance } from "./probability";

const {
  chance: initialChance,
  event: initialEvent,
  safe: initialSafe,
} = createDecisionEventFactory({
  createDecisionId: (event, key) =>
    `decision:${event}-${toKebabCase(key ?? "")}`,
  createEventPath: (event) => `academy.${toCamelCase(event)}`,
  createOutcomeId: (event, key, _position, result, kind) =>
    `outcome:${toCamelCase(event)}${capitalize(key ?? "")}${
      kind === "chance" ? capitalize(result) : ""
    }`,
  createTranslationPath: (event, key) => `academy.${toCamelCase(event)}.${key}`,
});

const firstExercises = initialEvent("first-exercises", [
  initialSafe("acceptStandard"),
  initialChance(
    40,
    [
      {
        stat: "piloting",
        weight: 0.3,
      },
      {
        stat: "synchrony",
        weight: 0.15,
      },
    ],
    "controlRare",
  ),
  initialSafe("requestStandard"),
]);

const strayZoid = initialEvent("stray-zoid", [
  initialChance(
    30,
    [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ],
    "capture",
  ),
  initialChance(
    40,
    [
      {
        stat: "tactics",
        weight: 0.3,
      },
      {
        stat: "piloting",
        weight: 0.15,
      },
    ],
    "destroy",
  ),
  initialSafe("protect"),
]);

const mechanicsProgram = initialEvent("mechanics-program", [
  initialSafe("join"),
  initialSafe("reject"),
  initialChance(
    60,
    [
      {
        stat: "technique",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ],
    "help",
  ),
]);

const veteranOffer = initialEvent("veteran-offer", [
  initialSafe("accept"),
  initialChance(
    60,
    [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "tactics",
        weight: 0.15,
      },
    ],
    "report",
  ),
  initialSafe("silence"),
]);

const humanitarianMission = initialEvent("humanitarian-mission", [
  initialChance(
    60,
    [
      {
        stat: "charisma",
        weight: 0.3,
      },
      {
        stat: "strength",
        weight: 0.15,
      },
    ],
    "volunteer",
  ),
  initialSafe("ignore"),
  initialSafe("organize"),
]);

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function toCamelCase(value: string): string {
  return value.replace(/-([a-z])/g, (_match, letter: string) =>
    letter.toUpperCase(),
  );
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export const eventCatalog = {
  firstExercises,
  humanitarianMission,
  mechanicsProgram,
  strayZoid,
  veteranOffer,
} as const satisfies Record<string, DecisionEvent>;

export const events = [
  ...Object.values(eventCatalog),
  ...academyEvents,
  ...earlyServiceEvents,
];
export const outcomeCatalog = {
  ...initialOutcomeCatalog,
  ...academyOutcomeCatalog,
  ...earlyServiceOutcomeCatalog,
} as const satisfies Record<OutcomeId, Outcome>;
const outcomeById: Readonly<Record<OutcomeId, Outcome>> = outcomeCatalog;

const eventById = new Map<EventId, DecisionEvent>(
  events.map((event) => [event.id, event]),
);

export function calculateAdjustedSuccessChance(
  decision: ChanceDecision,
  stats: Stats,
  potential = 0,
) {
  return createBoundedValue(
    calculateSuccessChance(
      decision.baseSuccessChance,
      decision.probabilityStats,
      stats,
      potential,
      decision.probabilityNeutralStat,
    ),
  );
}

export function getEvent(id: EventId): DecisionEvent {
  const event = eventById.get(id);

  if (!event) {
    throw new RangeError(`Unknown event identifier: ${id}.`);
  }

  return event;
}

export function getOutcome(outcomeId: OutcomeId): Outcome {
  const outcome = outcomeById[outcomeId];
  if (!outcome)
    throw new RangeError(`Unknown outcome identifier: ${outcomeId}.`);
  return outcome;
}

export function resolveDecision(
  decision: Decision,
  pilot: Pilot,
  random: RandomGenerator,
): DecisionResolution {
  if (decision.kind === "safe") {
    return {
      decisionId: decision.id,
      kind: "safe",
      outcomeId: decision.outcomeId,
    };
  }

  const adjustedSuccessChance = calculateAdjustedSuccessChance(
    decision,
    pilot.stats,
    pilot.potential,
  );
  const roll = createBoundedValue(random.probability() * 100);
  const result = roll < adjustedSuccessChance ? "success" : "failure";

  return {
    adjustedSuccessChance,
    decisionId: decision.id,
    kind: "chance",
    outcomeId:
      result === "success"
        ? decision.successOutcomeId
        : decision.failureOutcomeId,
    result,
    roll,
  };
}

export function validateEvents(events: readonly DecisionEvent[]): void {
  const decisionIds = new Set<string>();
  const eventIds = new Set<string>();
  const outcomeIds = new Set<OutcomeId>();

  for (const event of events) {
    if (eventIds.has(event.id)) {
      throw new TypeError(`Duplicate event identifier: ${event.id}.`);
    }

    if (event.decisions.length < 2) {
      throw new TypeError(
        `Event ${event.id} must have at least two decisions.`,
      );
    }

    eventIds.add(event.id);

    for (const decision of event.decisions) {
      if (decisionIds.has(decision.id)) {
        throw new TypeError(`Duplicate decision identifier: ${decision.id}.`);
      }

      decisionIds.add(decision.id);
      validateDecision(decision, outcomeIds);
    }
  }
}

function validateDecision(
  decision: Decision,
  referencedOutcomeIds: Set<OutcomeId>,
): void {
  const outcomeIds =
    decision.kind === "safe"
      ? [decision.outcomeId]
      : [decision.successOutcomeId, decision.failureOutcomeId];

  if (decision.kind === "chance") {
    const probabilityStatNames = decision.probabilityStats.map(
      ({ stat }) => stat,
    );

    if (new Set(probabilityStatNames).size !== probabilityStatNames.length) {
      throw new TypeError(
        `Decision ${decision.id} repeats a probability stat.`,
      );
    }

    if (
      decision.probabilityNeutralStat !== undefined &&
      (!Number.isFinite(decision.probabilityNeutralStat) ||
        decision.probabilityNeutralStat < 0 ||
        decision.probabilityNeutralStat > 100)
    ) {
      throw new TypeError(
        `Decision ${decision.id} has an invalid neutral stat.`,
      );
    }

    if (
      decision.probabilityStats.some(
        ({ weight }) => !Number.isFinite(weight) || weight <= 0,
      )
    ) {
      throw new TypeError(
        `Decision ${decision.id} has an invalid stat weight.`,
      );
    }
  }

  if (
    decision.kind === "chance" &&
    (!Number.isFinite(decision.baseSuccessChance) ||
      decision.baseSuccessChance < 0 ||
      decision.baseSuccessChance > 100)
  ) {
    throw new TypeError(`Decision ${decision.id} has an invalid probability.`);
  }

  for (const outcomeId of outcomeIds) {
    if (referencedOutcomeIds.has(outcomeId))
      throw new TypeError(`Duplicate outcome identifier: ${outcomeId}.`);
    if (!outcomeById[outcomeId])
      throw new TypeError(`Decision ${decision.id} references ${outcomeId}.`);
    referencedOutcomeIds.add(outcomeId);
  }
}

export function validateOutcomes(
  outcomes: Readonly<Record<OutcomeId, Outcome>>,
): void {
  for (const [id, outcome] of Object.entries(outcomes)) {
    if (id !== outcome.id)
      throw new TypeError(
        `Outcome catalog key ${id} does not match its identifier.`,
      );
    if (outcome.effects.length < 1)
      throw new TypeError(`Outcome ${id} must include at least one effect.`);
    for (const effect of outcome.effects) {
      if (
        "amount" in effect &&
        (!Number.isFinite(effect.amount) || effect.amount === 0)
      )
        throw new TypeError(`Outcome ${id} has an invalid effect amount.`);
      if (
        (effect.kind === "grant-zoid" ||
          effect.kind === "replace-signature-zoid") &&
        (!isZoidRewardPoolAvailable(effect.poolId, "guylos") ||
          !isZoidRewardPoolAvailable(effect.poolId, "helic"))
      )
        throw new TypeError(`Outcome ${id} uses an unavailable Zoid pool.`);
    }
  }
}

validateOutcomes(outcomeCatalog);
validateEvents(events);

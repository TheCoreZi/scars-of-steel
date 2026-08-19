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
  type StatChange,
  type Stats,
} from "./types";
import { hasInitialZoidPool } from "./zoidPools";

const outcome = (
  id: string,
  zoidReward: Outcome["zoidReward"],
  statChanges: readonly StatChange[],
  tags: readonly Outcome["tags"][number][] = [],
): Outcome => ({
  id: `outcome:${id}`,
  narrativeKey: `outcomes:academy.${id}`,
  statChanges,
  tags,
  zoidReward,
});

const firstExercises = {
  decisions: [
    {
      descriptionKey:
        "decisions:academy.firstExercises.acceptStandard.description",
      id: "decision:first-exercises-accept-standard",
      kind: "safe",
      labelKey: "decisions:academy.firstExercises.acceptStandard.label",
      outcome: outcome("firstExercisesAcceptStandard", "standard", [
        { amount: 2, stat: "piloting", target: "stat" },
        { amount: 3, stat: "synchrony", target: "stat" },
      ]),
    },
    {
      baseSuccessChance: createBoundedValue(40),
      descriptionKey:
        "decisions:academy.firstExercises.controlRare.description",
      failureOutcome: outcome("firstExercisesControlRareFailure", "weak", [
        { amount: -3, stat: "charisma", target: "stat" },
        { amount: -1, stat: "piloting", target: "stat" },
      ]),
      id: "decision:first-exercises-control-rare",
      kind: "chance",
      labelKey: "decisions:academy.firstExercises.controlRare.label",
      probabilityStats: [
        { stat: "piloting", weight: 0.3 },
        { stat: "synchrony", weight: 0.15 },
      ],
      successOutcome: outcome("firstExercisesControlRareSuccess", "rare", [
        { amount: 2, stat: "charisma", target: "stat" },
        { amount: 2, stat: "piloting", target: "stat" },
        { amount: 2, stat: "synchrony", target: "stat" },
      ]),
    },
    {
      descriptionKey:
        "decisions:academy.firstExercises.requestStandard.description",
      id: "decision:first-exercises-request-standard",
      kind: "safe",
      labelKey: "decisions:academy.firstExercises.requestStandard.label",
      outcome: outcome("firstExercisesRequestStandard", "standard", [
        { amount: -2, stat: "charisma", target: "stat" },
        { amount: 3, stat: "synchrony", target: "stat" },
      ]),
    },
  ],
  id: "event:first-exercises",
  introductionKey: "narrative:academy.firstExercises.introduction",
  titleKey: "narrative:academy.firstExercises.title",
} as const satisfies DecisionEvent;

const strayZoid = {
  decisions: [
    {
      baseSuccessChance: createBoundedValue(30),
      descriptionKey: "decisions:academy.strayZoid.capture.description",
      failureOutcome: outcome("strayZoidCaptureFailure", "weak", [
        { amount: -2, stat: "piloting", target: "stat" },
        { amount: -2, stat: "strength", target: "stat" },
      ]),
      id: "decision:stray-zoid-capture",
      kind: "chance",
      labelKey: "decisions:academy.strayZoid.capture.label",
      probabilityStats: [
        { stat: "tactics", weight: 0.3 },
        { stat: "piloting", weight: 0.15 },
      ],
      successOutcome: outcome("strayZoidCaptureSuccess", "rare", [
        { amount: 2, stat: "charisma", target: "stat" },
        { amount: 2, stat: "piloting", target: "stat" },
        { amount: 3, stat: "synchrony", target: "stat" },
      ]),
    },
    {
      baseSuccessChance: createBoundedValue(40),
      descriptionKey: "decisions:academy.strayZoid.destroy.description",
      failureOutcome: outcome("strayZoidDestroyFailure", "weak", [
        { amount: -3, stat: "piloting", target: "stat" },
        { amount: -1, stat: "strength", target: "stat" },
        { amount: -1, stat: "synchrony", target: "stat" },
      ]),
      id: "decision:stray-zoid-destroy",
      kind: "chance",
      labelKey: "decisions:academy.strayZoid.destroy.label",
      probabilityStats: [
        { stat: "tactics", weight: 0.3 },
        { stat: "piloting", weight: 0.15 },
      ],
      successOutcome: outcome("strayZoidDestroySuccess", "standard", [
        { amount: 3, stat: "piloting", target: "stat" },
        { amount: 2, stat: "strength", target: "stat" },
      ]),
    },
    {
      descriptionKey: "decisions:academy.strayZoid.protect.description",
      id: "decision:stray-zoid-protect",
      kind: "safe",
      labelKey: "decisions:academy.strayZoid.protect.label",
      outcome: outcome("strayZoidProtect", "standard", [
        { amount: 1, stat: "tactics", target: "stat" },
        { amount: 1, stat: "technique", target: "stat" },
        { amount: 2, stat: "charisma", target: "stat" },
      ]),
    },
  ],
  id: "event:stray-zoid",
  introductionKey: "narrative:academy.strayZoid.introduction",
  titleKey: "narrative:academy.strayZoid.title",
} as const satisfies DecisionEvent;

const mechanicsProgram = {
  decisions: [
    {
      descriptionKey: "decisions:academy.mechanicsProgram.join.description",
      id: "decision:mechanics-program-join",
      kind: "safe",
      labelKey: "decisions:academy.mechanicsProgram.join.label",
      outcome: outcome(
        "mechanicsProgramJoin",
        "rare",
        [
          { amount: -2, stat: "piloting", target: "stat" },
          { amount: 2, stat: "synchrony", target: "stat" },
          { amount: 4, stat: "technique", target: "stat" },
        ],
        ["outcome-tag:mechanics-program"],
      ),
    },
    {
      descriptionKey: "decisions:academy.mechanicsProgram.reject.description",
      id: "decision:mechanics-program-reject",
      kind: "safe",
      labelKey: "decisions:academy.mechanicsProgram.reject.label",
      outcome: outcome("mechanicsProgramReject", "standard", [
        { amount: 3, stat: "piloting", target: "stat" },
        { amount: 2, stat: "strength", target: "stat" },
      ]),
    },
    {
      baseSuccessChance: createBoundedValue(60),
      descriptionKey: "decisions:academy.mechanicsProgram.help.description",
      failureOutcome: outcome("mechanicsProgramHelpFailure", "weak", [
        { amount: -2, stat: "piloting", target: "stat" },
        { amount: -3, stat: "strength", target: "stat" },
        { amount: -2, stat: "technique", target: "stat" },
      ]),
      id: "decision:mechanics-program-help",
      kind: "chance",
      labelKey: "decisions:academy.mechanicsProgram.help.label",
      probabilityStats: [
        { stat: "technique", weight: 0.3 },
        { stat: "strength", weight: 0.15 },
      ],
      successOutcome: outcome("mechanicsProgramHelpSuccess", "rare", [
        { amount: 2, stat: "piloting", target: "stat" },
        { amount: 2, stat: "synchrony", target: "stat" },
        { amount: 4, stat: "technique", target: "stat" },
      ]),
    },
  ],
  id: "event:mechanics-program",
  introductionKey: "narrative:academy.mechanicsProgram.introduction",
  titleKey: "narrative:academy.mechanicsProgram.title",
} as const satisfies DecisionEvent;

const veteranOffer = {
  decisions: [
    {
      descriptionKey: "decisions:academy.veteranOffer.accept.description",
      id: "decision:veteran-offer-accept",
      kind: "safe",
      labelKey: "decisions:academy.veteranOffer.accept.label",
      outcome: outcome(
        "veteranOfferAccept",
        "super-rare",
        [
          { amount: 2, indicator: "fame", target: "career-indicator" },
          { amount: 2, stat: "tactics", target: "stat" },
          { amount: -2, stat: "strength", target: "stat" },
        ],
        ["outcome-tag:veteran-debt"],
      ),
    },
    {
      baseSuccessChance: createBoundedValue(60),
      descriptionKey: "decisions:academy.veteranOffer.report.description",
      failureOutcome: outcome(
        "veteranOfferReportFailure",
        "weak",
        [
          { amount: -3, indicator: "fame", target: "career-indicator" },
          { amount: -2, stat: "charisma", target: "stat" },
          { amount: -1, stat: "tactics", target: "stat" },
        ],
        ["outcome-tag:veteran-discredit"],
      ),
      id: "decision:veteran-offer-report",
      kind: "chance",
      labelKey: "decisions:academy.veteranOffer.report.label",
      probabilityStats: [
        { stat: "charisma", weight: 0.3 },
        { stat: "tactics", weight: 0.15 },
      ],
      successOutcome: outcome(
        "veteranOfferReportSuccess",
        "standard",
        [
          { amount: 3, indicator: "fame", target: "career-indicator" },
          { amount: 2, stat: "charisma", target: "stat" },
          { amount: 1, stat: "tactics", target: "stat" },
        ],
        ["outcome-tag:reported-veteran"],
      ),
    },
    {
      descriptionKey: "decisions:academy.veteranOffer.silence.description",
      id: "decision:veteran-offer-silence",
      kind: "safe",
      labelKey: "decisions:academy.veteranOffer.silence.label",
      outcome: outcome(
        "veteranOfferSilence",
        "standard",
        [
          { amount: 2, stat: "tactics", target: "stat" },
          { amount: 3, stat: "synchrony", target: "stat" },
        ],
        ["outcome-tag:veteran-secret"],
      ),
    },
  ],
  id: "event:veteran-offer",
  introductionKey: "narrative:academy.veteranOffer.introduction",
  titleKey: "narrative:academy.veteranOffer.title",
} as const satisfies DecisionEvent;

const humanitarianMission = {
  decisions: [
    {
      baseSuccessChance: createBoundedValue(60),
      descriptionKey:
        "decisions:academy.humanitarianMission.volunteer.description",
      failureOutcome: outcome(
        "humanitarianMissionVolunteerFailure",
        "weak",
        [
          { amount: 1, indicator: "fame", target: "career-indicator" },
          { amount: 1, stat: "charisma", target: "stat" },
          { amount: -2, stat: "piloting", target: "stat" },
          { amount: -4, stat: "strength", target: "stat" },
        ],
        ["outcome-tag:injured", "outcome-tag:humanitarian-aid"],
      ),
      id: "decision:humanitarian-mission-volunteer",
      kind: "chance",
      labelKey: "decisions:academy.humanitarianMission.volunteer.label",
      probabilityStats: [
        { stat: "charisma", weight: 0.3 },
        { stat: "strength", weight: 0.15 },
      ],
      successOutcome: outcome(
        "humanitarianMissionVolunteerSuccess",
        "rare",
        [
          { amount: 2, indicator: "fame", target: "career-indicator" },
          { amount: 3, stat: "charisma", target: "stat" },
          { amount: -2, stat: "piloting", target: "stat" },
          { amount: -2, stat: "strength", target: "stat" },
          { amount: 2, stat: "synchrony", target: "stat" },
        ],
        ["outcome-tag:humanitarian-aid"],
      ),
    },
    {
      descriptionKey:
        "decisions:academy.humanitarianMission.ignore.description",
      id: "decision:humanitarian-mission-ignore",
      kind: "safe",
      labelKey: "decisions:academy.humanitarianMission.ignore.label",
      outcome: outcome("humanitarianMissionIgnore", "standard", [
        { amount: -2, stat: "charisma", target: "stat" },
        { amount: 3, stat: "piloting", target: "stat" },
        { amount: 3, stat: "strength", target: "stat" },
      ]),
    },
    {
      descriptionKey:
        "decisions:academy.humanitarianMission.organize.description",
      id: "decision:humanitarian-mission-organize",
      kind: "safe",
      labelKey: "decisions:academy.humanitarianMission.organize.label",
      outcome: outcome("humanitarianMissionOrganize", "standard", [
        { amount: 3, stat: "tactics", target: "stat" },
        { amount: 2, stat: "strength", target: "stat" },
        { amount: -2, stat: "synchrony", target: "stat" },
      ]),
    },
  ],
  id: "event:humanitarian-mission",
  introductionKey: "narrative:academy.humanitarianMission.introduction",
  titleKey: "narrative:academy.humanitarianMission.title",
} as const satisfies DecisionEvent;

export const eventCatalog = {
  firstExercises,
  humanitarianMission,
  mechanicsProgram,
  strayZoid,
  veteranOffer,
} as const satisfies Record<string, DecisionEvent>;

const events = Object.values(eventCatalog);

const eventById = new Map<EventId, DecisionEvent>(
  events.map((event) => [event.id, event]),
);

export function calculateAdjustedSuccessChance(
  decision: ChanceDecision,
  stats: Stats,
) {
  const statMultiplier = decision.probabilityStats.reduce(
    (total, { stat, weight }) => total + weight * Math.sqrt(stats[stat] / 5),
    1,
  );
  const multiplier = Math.min(2.5, statMultiplier);
  const adjustedChance = Math.round(decision.baseSuccessChance * multiplier);

  return createBoundedValue(Math.min(95, Math.max(5, adjustedChance)));
}

export function getEvent(id: EventId): DecisionEvent {
  const event = eventById.get(id);

  if (!event) {
    throw new RangeError(`Unknown event identifier: ${id}.`);
  }

  return event;
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
      outcomeId: decision.outcome.id,
    };
  }

  const adjustedSuccessChance = calculateAdjustedSuccessChance(
    decision,
    pilot.stats,
  );
  const roll = createBoundedValue(random.probability() * 100);
  const result = roll < adjustedSuccessChance ? "success" : "failure";

  return {
    adjustedSuccessChance,
    decisionId: decision.id,
    kind: "chance",
    outcomeId:
      result === "success"
        ? decision.successOutcome.id
        : decision.failureOutcome.id,
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

    if (event.decisions.length !== 3) {
      throw new TypeError(`Event ${event.id} must have three decisions.`);
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
  outcomeIds: Set<OutcomeId>,
): void {
  const outcomes =
    decision.kind === "safe"
      ? [decision.outcome]
      : [decision.successOutcome, decision.failureOutcome];

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

  for (const result of outcomes) {
    if (outcomeIds.has(result.id)) {
      throw new TypeError(`Duplicate outcome identifier: ${result.id}.`);
    }

    if (result.statChanges.length < 1) {
      throw new TypeError(
        `Outcome ${result.id} must include at least one change.`,
      );
    }

    if (
      !hasInitialZoidPool(result.zoidReward, "guylos") ||
      !hasInitialZoidPool(result.zoidReward, "helic")
    ) {
      throw new TypeError(
        `Outcome ${result.id} uses an unavailable Zoid category.`,
      );
    }

    outcomeIds.add(result.id);
  }
}

validateEvents(events);

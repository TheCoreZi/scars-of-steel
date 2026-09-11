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
import { calculateSuccessChance } from "./probability";

const firstExercises = {
  decisions: [
    {
      descriptionKey:
        "decisions:academy.firstExercises.acceptStandard.description",
      id: "decision:first-exercises-accept-standard",
      kind: "safe",
      labelKey: "decisions:academy.firstExercises.acceptStandard.label",
      outcomeId: "outcome:firstExercisesAcceptStandard",
    },
    {
      baseSuccessChance: createBoundedValue(40),
      descriptionKey:
        "decisions:academy.firstExercises.controlRare.description",
      failureOutcomeId: "outcome:firstExercisesControlRareFailure",
      id: "decision:first-exercises-control-rare",
      kind: "chance",
      labelKey: "decisions:academy.firstExercises.controlRare.label",
      probabilityStats: [
        { stat: "piloting", weight: 0.3 },
        { stat: "synchrony", weight: 0.15 },
      ],
      successOutcomeId: "outcome:firstExercisesControlRareSuccess",
    },
    {
      descriptionKey:
        "decisions:academy.firstExercises.requestStandard.description",
      id: "decision:first-exercises-request-standard",
      kind: "safe",
      labelKey: "decisions:academy.firstExercises.requestStandard.label",
      outcomeId: "outcome:firstExercisesRequestStandard",
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
      failureOutcomeId: "outcome:strayZoidCaptureFailure",
      id: "decision:stray-zoid-capture",
      kind: "chance",
      labelKey: "decisions:academy.strayZoid.capture.label",
      probabilityStats: [
        { stat: "tactics", weight: 0.3 },
        { stat: "piloting", weight: 0.15 },
      ],
      successOutcomeId: "outcome:strayZoidCaptureSuccess",
    },
    {
      baseSuccessChance: createBoundedValue(40),
      descriptionKey: "decisions:academy.strayZoid.destroy.description",
      failureOutcomeId: "outcome:strayZoidDestroyFailure",
      id: "decision:stray-zoid-destroy",
      kind: "chance",
      labelKey: "decisions:academy.strayZoid.destroy.label",
      probabilityStats: [
        { stat: "tactics", weight: 0.3 },
        { stat: "piloting", weight: 0.15 },
      ],
      successOutcomeId: "outcome:strayZoidDestroySuccess",
    },
    {
      descriptionKey: "decisions:academy.strayZoid.protect.description",
      id: "decision:stray-zoid-protect",
      kind: "safe",
      labelKey: "decisions:academy.strayZoid.protect.label",
      outcomeId: "outcome:strayZoidProtect",
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
      outcomeId: "outcome:mechanicsProgramJoin",
    },
    {
      descriptionKey: "decisions:academy.mechanicsProgram.reject.description",
      id: "decision:mechanics-program-reject",
      kind: "safe",
      labelKey: "decisions:academy.mechanicsProgram.reject.label",
      outcomeId: "outcome:mechanicsProgramReject",
    },
    {
      baseSuccessChance: createBoundedValue(60),
      descriptionKey: "decisions:academy.mechanicsProgram.help.description",
      failureOutcomeId: "outcome:mechanicsProgramHelpFailure",
      id: "decision:mechanics-program-help",
      kind: "chance",
      labelKey: "decisions:academy.mechanicsProgram.help.label",
      probabilityStats: [
        { stat: "technique", weight: 0.3 },
        { stat: "strength", weight: 0.15 },
      ],
      successOutcomeId: "outcome:mechanicsProgramHelpSuccess",
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
      outcomeId: "outcome:veteranOfferAccept",
    },
    {
      baseSuccessChance: createBoundedValue(60),
      descriptionKey: "decisions:academy.veteranOffer.report.description",
      failureOutcomeId: "outcome:veteranOfferReportFailure",
      id: "decision:veteran-offer-report",
      kind: "chance",
      labelKey: "decisions:academy.veteranOffer.report.label",
      probabilityStats: [
        { stat: "charisma", weight: 0.3 },
        { stat: "tactics", weight: 0.15 },
      ],
      successOutcomeId: "outcome:veteranOfferReportSuccess",
    },
    {
      descriptionKey: "decisions:academy.veteranOffer.silence.description",
      id: "decision:veteran-offer-silence",
      kind: "safe",
      labelKey: "decisions:academy.veteranOffer.silence.label",
      outcomeId: "outcome:veteranOfferSilence",
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
      failureOutcomeId: "outcome:humanitarianMissionVolunteerFailure",
      id: "decision:humanitarian-mission-volunteer",
      kind: "chance",
      labelKey: "decisions:academy.humanitarianMission.volunteer.label",
      probabilityStats: [
        { stat: "charisma", weight: 0.3 },
        { stat: "strength", weight: 0.15 },
      ],
      successOutcomeId: "outcome:humanitarianMissionVolunteerSuccess",
    },
    {
      descriptionKey:
        "decisions:academy.humanitarianMission.ignore.description",
      id: "decision:humanitarian-mission-ignore",
      kind: "safe",
      labelKey: "decisions:academy.humanitarianMission.ignore.label",
      outcomeId: "outcome:humanitarianMissionIgnore",
    },
    {
      descriptionKey:
        "decisions:academy.humanitarianMission.organize.description",
      id: "decision:humanitarian-mission-organize",
      kind: "safe",
      labelKey: "decisions:academy.humanitarianMission.organize.label",
      outcomeId: "outcome:humanitarianMissionOrganize",
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

export const events = [...Object.values(eventCatalog), ...academyEvents];
export const outcomeCatalog = {
  ...initialOutcomeCatalog,
  ...academyOutcomeCatalog,
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

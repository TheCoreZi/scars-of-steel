import {
  createBoundedValue,
  type ChanceDecision,
  type Decision,
  type DecisionEvent,
  type DecisionId,
  type EventId,
  type Faction,
  type OutcomeId,
  type ProbabilityStat,
  type SafeDecision,
  type TranslationKey,
} from "./types.ts";

interface ChanceDecisionDefinition {
  baseSuccessChance: number;
  key?: string;
  kind: "chance";
  probabilityStats: readonly [ProbabilityStat, ...ProbabilityStat[]];
}

type DecisionDefinition = ChanceDecisionDefinition | SafeDecisionDefinition;

type CreatedDecision<Definition extends DecisionDefinition> =
  Definition extends ChanceDecisionDefinition ? ChanceDecision : SafeDecision;

type CreatedDecisionEvent<Definitions extends readonly DecisionDefinition[]> =
  Omit<DecisionEvent, "decisions"> & {
    decisions: {
      readonly [Index in keyof Definitions]: CreatedDecision<
        Definitions[Index]
      >;
    };
  };

interface DecisionEventFactoryOptions {
  ages?: readonly number[];
  createDecisionId?: (
    event: string,
    key: string | undefined,
    position: number,
  ) => DecisionId;
  createEventPath?: (event: string) => string;
  createOutcomeId?: (
    event: string,
    key: string | undefined,
    position: number,
    result: "failure" | "success",
    kind: DecisionDefinition["kind"],
  ) => OutcomeId;
  createTranslationPath?: (
    event: string,
    key: string | undefined,
    position: number,
  ) => string;
  eventOptions?: EventOptions;
  factions?: readonly Faction[];
  idPrefix?: string;
  translationPrefix?: string;
}

type EventOptions = Pick<
  DecisionEvent,
  "ages" | "factions" | "requiredCareerFlags" | "requiresZoid"
>;

interface SafeDecisionDefinition {
  key?: string;
  kind: "safe";
}

export function createDecisionEventFactory({
  ages,
  createDecisionId,
  createEventPath,
  createOutcomeId,
  createTranslationPath,
  eventOptions = {},
  factions,
  idPrefix = "",
  translationPrefix = "",
}: DecisionEventFactoryOptions = {}) {
  return {
    chance(
      baseSuccessChance: number,
      probabilityStats: readonly [ProbabilityStat, ...ProbabilityStat[]],
      key?: string,
    ): ChanceDecisionDefinition {
      return { baseSuccessChance, key, kind: "chance", probabilityStats };
    },
    event<const Definitions extends readonly DecisionDefinition[]>(
      id: string,
      definitions: Definitions,
      options: EventOptions = {},
    ): CreatedDecisionEvent<Definitions> {
      if (definitions.length < 2)
        throw new TypeError(`Event ${id} must have at least two decisions.`);
      const eventPath = createEventPath?.(id) ?? `${translationPrefix}${id}`;
      return {
        ...(ages ? { ages } : {}),
        decisions: definitions.map((definition, index) =>
          createDecision(id, definition, index + 1),
        ),
        ...(factions ? { factions } : {}),
        id: `event:${idPrefix}${id}` as EventId,
        introductionKey:
          `narrative:${eventPath}.introduction` as TranslationKey<"narrative">,
        titleKey: `narrative:${eventPath}.title` as TranslationKey<"narrative">,
        ...eventOptions,
        ...options,
      } as CreatedDecisionEvent<Definitions>;
    },
    safe(key?: string): SafeDecisionDefinition {
      return { key, kind: "safe" };
    },
  };

  function createDecision(
    event: string,
    definition: DecisionDefinition,
    position: number,
  ): Decision {
    const { key } = definition;
    const decisionId =
      createDecisionId?.(event, key, position) ??
      (`decision:${idPrefix}${event}-${position}` as DecisionId);
    const path =
      createTranslationPath?.(event, key, position) ??
      `${translationPrefix}${event}.${position}`;
    const outcomeId = (result: "failure" | "success") =>
      createOutcomeId?.(event, key, position, result, definition.kind) ??
      (`outcome:${idPrefix}${event}-${position}-${result}` as OutcomeId);
    const shared = {
      descriptionKey:
        `decisions:${path}.description` as TranslationKey<"decisions">,
      id: decisionId,
      labelKey: `decisions:${path}.label` as TranslationKey<"decisions">,
    };

    return definition.kind === "safe"
      ? {
          ...shared,
          kind: "safe",
          outcomeId: outcomeId("success"),
        }
      : {
          ...shared,
          baseSuccessChance: createBoundedValue(definition.baseSuccessChance),
          failureOutcomeId: outcomeId("failure"),
          kind: "chance",
          probabilityStats: definition.probabilityStats,
          successOutcomeId: outcomeId("success"),
        };
  }
}

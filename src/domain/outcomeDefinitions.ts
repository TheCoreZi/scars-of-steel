import type {
  CareerFlag,
  Outcome,
  OutcomeEffect,
  OutcomeId,
  StatName,
} from "./types";

interface GeneratedOutcomeDefinition {
  failure?: readonly OutcomeEffect[];
  path: string;
  success: readonly OutcomeEffect[];
}

export type OutcomeDefinition = GeneratedOutcomeDefinition | Outcome;

interface OutcomeFactoryOptions {
  idPrefix?: string;
  translationPrefix?: string;
}

export const damageZoid = { kind: "damage-signature-zoid" } as const;
export const injurePilot = { kind: "injure-pilot" } as const;
export const promote = { kind: "change-military-rank" } as const;

export function careerFlag(careerFlag: CareerFlag): OutcomeEffect {
  return { careerFlag, kind: "grant-career-flag" };
}

export function careerIndicator(
  indicator: "faction-trust" | "fame",
  amount: number,
): OutcomeEffect {
  return { amount, indicator, kind: "change-career-indicator" };
}

export function createOutcomeFactory({
  idPrefix = "",
  translationPrefix = "",
}: OutcomeFactoryOptions = {}) {
  return {
    catalog(definitions: readonly OutcomeDefinition[]) {
      return Object.fromEntries(
        definitions.flatMap((definition) =>
          "path" in definition
            ? [
                createOutcome(definition.path, "success", definition.success),
                ...(definition.failure
                  ? [
                      createOutcome(
                        definition.path,
                        "failure",
                        definition.failure,
                      ),
                    ]
                  : []),
              ]
            : [[definition.id, definition] as const],
        ),
      ) as Record<OutcomeId, Outcome>;
    },
    outcome(
      id: OutcomeId,
      narrativeKey: Outcome["narrativeKey"],
      effects: readonly OutcomeEffect[],
    ): Outcome {
      return { effects, id, narrativeKey };
    },
  };

  function createOutcome(
    path: string,
    result: "failure" | "success",
    effects: readonly OutcomeEffect[],
  ): readonly [OutcomeId, Outcome] {
    const [event, choice] = path.split(".");
    const id = `outcome:${idPrefix}${event}-${choice}-${result}` as OutcomeId;
    return [
      id,
      {
        effects,
        id,
        narrativeKey:
          `outcomes:${translationPrefix}${path}.${result}` as Outcome["narrativeKey"],
      },
    ];
  }
}

export function statChange(stat: StatName, amount: number): OutcomeEffect {
  return { amount, kind: "change-stat", stat };
}

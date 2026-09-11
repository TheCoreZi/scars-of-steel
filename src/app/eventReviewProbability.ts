import { calculateSuccessChance } from "../domain/probability";
import { createBoundedValue, type Stats } from "../domain/types";

export const reviewProbabilityStatNames = [
  "strength",
  "piloting",
  "synchrony",
  "charisma",
  "technique",
  "tactics",
  "potential",
] as const;

export type ReviewProbabilityStat = (typeof reviewProbabilityStatNames)[number];
export type ReviewProbabilityWeights = Record<ReviewProbabilityStat, number>;

export function calculateReviewSuccessChance(
  baseSuccessChance: number,
  weights: ReviewProbabilityWeights,
  statValue: number,
): number {
  const stats = Object.fromEntries(
    reviewProbabilityStatNames
      .filter((stat) => stat !== "potential")
      .map((stat) => [stat, createBoundedValue(statValue)]),
  ) as unknown as Stats;
  return calculateSuccessChance(
    baseSuccessChance,
    reviewProbabilityStatNames.map((stat) => ({ stat, weight: weights[stat] })),
    stats,
    statValue,
  );
}

export function parseProbabilityWeights(
  value: string,
): ReviewProbabilityWeights {
  const weights = Object.fromEntries(
    reviewProbabilityStatNames.map((stat) => [stat, 0]),
  ) as ReviewProbabilityWeights;

  value.split(";").forEach((entry) => {
    const [stat, weight] = entry.split(":");

    if (reviewProbabilityStatNames.includes(stat as ReviewProbabilityStat)) {
      weights[stat as ReviewProbabilityStat] = Number(weight) || 0;
    }
  });

  return weights;
}

export function serializeProbabilityWeights(
  weights: ReviewProbabilityWeights,
): string {
  return reviewProbabilityStatNames
    .filter((stat) => weights[stat] !== 0)
    .map((stat) => `${stat}:${weights[stat]}`)
    .join(";");
}

import type { ProbabilityStat, Stats } from "./types";

export function calculateSuccessChance(
  base: number,
  weights: readonly ProbabilityStat[],
  stats: Stats,
  potential = 0,
  neutral = 2,
): number {
  const impact = weights.reduce((total, { stat, weight }) => {
    const distance = (stat === "potential" ? potential : stats[stat]) - neutral;
    return (
      total + weight * 8 * Math.sign(distance) * Math.sqrt(Math.abs(distance))
    );
  }, 0);
  return Math.min(95, Math.max(5, Math.round(base + impact)));
}

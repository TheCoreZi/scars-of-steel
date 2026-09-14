import { simulateBattleYear } from "./battles";
import { getOutcome, resolveDecision } from "./events";
import { applyOutcome, hasOutcomeEffect } from "./outcomes";
import type { RandomGenerator } from "./random";
import { hasMinimumRank } from "./ranks";
import type { Decision, DecisionEvent, Pilot, ResolvedYear } from "./types";
import { advanceWarState, getWarBattleCount } from "./war";
import { applyAnnualGrowth, resolveAnnualRecovery } from "./annualRecovery";
import { advanceCareerYear, resolveAnnualPromotion } from "./career";

export function resolveYear(
  decision: Decision,
  _event: DecisionEvent,
  pilot: Pilot,
  random: RandomGenerator,
): ResolvedYear {
  const resolution = resolveDecision(decision, pilot, random);
  const outcome = getOutcome(resolution.outcomeId);
  const appliedOutcome = applyOutcome(pilot, outcome, random);
  const canFight =
    appliedOutcome.pilotAfter.condition !== "dead" &&
    hasMinimumRank(pilot.career.militaryRank, "private");
  const battles =
    appliedOutcome.pilotAfter.condition === "dead"
      ? 0
      : getWarBattleCount(appliedOutcome.pilotAfter.career.warState, random);
  const battleYear = simulateBattleYear(
    appliedOutcome.pilotAfter,
    battles,
    appliedOutcome.pilotAfter.career.warState,
    random,
    canFight,
  );
  const warYear = advanceWarState(
    battleYear.pilot.career.warState,
    battleYear.firstFactionWins,
    battleYear.secondFactionWins,
  );
  const afterWar = {
    ...battleYear.pilot,
    career: { ...battleYear.pilot.career, warState: warYear.warState },
  };
  const growth =
    afterWar.condition !== "dead"
      ? applyAnnualGrowth(afterWar, pilot, random)
      : { pilotAfter: afterWar, changes: [] };
  const recovered = resolveAnnualRecovery(
    growth.pilotAfter,
    random,
    battleYear.record.injured,
  );
  const narrativePromotion =
    recovered.pilot.career.militaryRank !== pilot.career.militaryRank;
  const afterPromotion = resolveAnnualPromotion(
    recovered.pilot,
    battleYear.record,
    random,
    !narrativePromotion &&
      (resolution.kind === "safe" || resolution.result === "success"),
  );
  const nextCareer = advanceCareerYear(afterPromotion, outcome).career;
  const promoted = nextCareer.militaryRank !== pilot.career.militaryRank;
  const pilotAfter = { ...afterPromotion, career: nextCareer };
  const changes = [
    ...appliedOutcome.changes,
    ...growth.changes,
    ...(warYear.change ? [warYear.change] : []),
  ];

  return {
    achievementIds: appliedOutcome.achievementIds,
    annualReport: {
      bonusIds: appliedOutcome.bonusIds,
      growth: growth.pilotAfter.basePotential - afterWar.basePotential,
      injured:
        hasOutcomeEffect(outcome, "injure-pilot") || battleYear.record.injured,
      promoted,
      rolls: recovered.rolls,
      zoidDamaged:
        hasOutcomeEffect(outcome, "damage-signature-zoid") ||
        battleYear.record.zoidDamaged,
    },
    battleRecord: battleYear.record,
    changes,
    outcome,
    pilotAfter,
    pilotBefore: pilot,
    resolution,
    zoidIds: appliedOutcome.zoidIds,
  };
}

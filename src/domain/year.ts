import { simulateBattleYear } from "./battles";
import { getOutcome, resolveDecision } from "./events";
import { applyOutcome, getAchievementIds } from "./outcomes";
import type { RandomGenerator } from "./random";
import type { Decision, DecisionEvent, Pilot, ResolvedYear } from "./types";
import { advanceWarState, getWarBattleCount } from "./war";
import { selectInitialZoid } from "./zoidPools";

export function resolveYear(
  decision: Decision,
  event: DecisionEvent,
  pilot: Pilot,
  random: RandomGenerator,
): ResolvedYear {
  const resolution = resolveDecision(decision, pilot, random);
  const outcome = getOutcome(event, resolution.outcomeId);
  const zoid = outcome.zoidReward
    ? selectInitialZoid(outcome.zoidReward, pilot.faction, random)
    : null;
  const appliedOutcome = applyOutcome(pilot, outcome, zoid?.id);
  const battles = getWarBattleCount(
    appliedOutcome.pilotAfter.career.warState,
    random,
  );
  const battleYear = simulateBattleYear(
    appliedOutcome.pilotAfter,
    battles,
    appliedOutcome.pilotAfter.career.warState,
    random,
  );
  const warYear = advanceWarState(
    battleYear.pilot.career.warState,
    battleYear.firstFactionWins,
    battleYear.secondFactionWins,
  );
  const pilotAfter = {
    ...battleYear.pilot,
    career: { ...battleYear.pilot.career, warState: warYear.warState },
  };

  return {
    achievementIds: getAchievementIds(outcome),
    battleRecord: battleYear.record,
    changes: warYear.change
      ? [...appliedOutcome.changes, warYear.change]
      : appliedOutcome.changes,
    outcome,
    pilotAfter,
    pilotBefore: pilot,
    resolution,
    zoidIds: zoid ? [zoid.id] : [],
  };
}

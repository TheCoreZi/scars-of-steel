import type {
  BattleRecord,
  CareerEndReason,
  CareerHistory,
  EventId,
  Outcome,
  Pilot,
  ResolvedYear,
} from "./types";
import { getFactionControl } from "./war";
import { getOutcomeEndReason } from "./outcomes";
import type { RandomGenerator } from "./random";
import { promotePilot } from "./ranks";

const automaticPromotionBaseChance = {
  cadet: 0,
  captain: 4,
  commander: 1,
  corporal: 18,
  general: 0,
  lieutenant: 8,
  major: 2,
  private: 32,
  sergeant: 2,
} as const;

export function advanceCareerYear(pilot: Pilot, outcome?: Outcome): Pilot {
  const promoted =
    pilot.age === 14 &&
    pilot.condition !== "dead" &&
    pilot.career.militaryRank === "cadet" &&
    (!outcome || !getOutcomeEndReason(outcome));
  const advancedPilot = {
    ...pilot,
    age: pilot.age + 1,
  };
  return promoted ? promotePilot(advancedPilot) : advancedPilot;
}

export function createCareerHistory(): CareerHistory {
  return {
    achievementIds: [],
    battles: { losses: 0, participated: 0, wins: 0 },
    completedEventIds: [],
  };
}

export function getAutomaticPromotionChance(
  pilot: Pilot,
  battleRecord: BattleRecord,
): number {
  const rankChance = automaticPromotionBaseChance[pilot.career.militaryRank];
  const merit = Math.floor(
    ([
      ...Object.values(pilot.stats),
      pilot.career.factionTrust,
      pilot.career.fame,
    ].reduce((total, value) => total + value, 0) /
      8) *
      0.2,
  );
  return Math.min(
    90,
    Math.max(
      0,
      rankChance + battleRecord.wins * 6 - battleRecord.losses * 4 + merit,
    ),
  );
}

export function resolveAnnualPromotion(
  pilot: Pilot,
  battleRecord: BattleRecord,
  random: RandomGenerator,
  eligible = true,
): Pilot {
  if (
    !eligible ||
    pilot.career.militaryRank === "cadet" ||
    pilot.condition === "dead"
  )
    return pilot;
  const chance = getAutomaticPromotionChance(pilot, battleRecord);
  return chance > 0 && random.probability() * 100 < chance
    ? promotePilot(pilot)
    : pilot;
}

export function getCareerEndReason(
  pilot: Pilot,
  eligibleEventIds: readonly EventId[],
  outcome: Outcome,
): CareerEndReason | null {
  if (pilot.condition === "dead") {
    return "dead";
  }

  const factionControl = getFactionControl(
    pilot.career.warState,
    pilot.faction,
  );

  if (factionControl === 100) {
    return "war-won";
  }

  if (factionControl === 0) {
    return "war-lost";
  }

  const outcomeEndReason = getOutcomeEndReason(outcome);
  if (outcomeEndReason) return outcomeEndReason;

  return eligibleEventIds.length === 0 ? "no-eligible-events" : null;
}

export function recordResolvedYear(
  history: CareerHistory,
  eventId: EventId,
  result: ResolvedYear,
): CareerHistory {
  return {
    achievementIds: [
      ...new Set([...history.achievementIds, ...result.achievementIds]),
    ],
    battles: {
      losses: history.battles.losses + result.battleRecord.losses,
      participated:
        history.battles.participated + result.battleRecord.participated,
      wins: history.battles.wins + result.battleRecord.wins,
    },
    completedEventIds: [...new Set([...history.completedEventIds, eventId])],
  };
}

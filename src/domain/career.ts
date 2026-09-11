import type {
  CareerEndReason,
  CareerHistory,
  EventId,
  Outcome,
  Pilot,
  ResolvedYear,
} from "./types";
import { getFactionControl } from "./war";
import { getOutcomeEndReason } from "./outcomes";

export function advanceCareerYear(pilot: Pilot, outcome?: Outcome): Pilot {
  const promoted =
    pilot.age === 14 &&
    pilot.condition !== "dead" &&
    pilot.career.militaryRank === "cadet" &&
    (!outcome || !getOutcomeEndReason(outcome));
  return {
    ...pilot,
    age: pilot.age + 1,
    career: {
      ...pilot.career,
      militaryRank: promoted ? "soldier" : pilot.career.militaryRank,
    },
  };
}

export function createCareerHistory(): CareerHistory {
  return {
    achievementIds: [],
    battles: { losses: 0, participated: 0, wins: 0 },
    completedEventIds: [],
  };
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

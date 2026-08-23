import type {
  CareerEndReason,
  CareerHistory,
  EventId,
  Outcome,
  Pilot,
  ResolvedYear,
} from "./types";
import { getFactionControl } from "./war";

export function advanceCareerYear(pilot: Pilot): Pilot {
  return { ...pilot, age: pilot.age + 1 };
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

  if (outcome.tags.includes("outcome-tag:retired")) {
    return "retired";
  }

  if (outcome.tags.includes("outcome-tag:disappeared")) {
    return "disappeared";
  }

  if (outcome.tags.includes("outcome-tag:non-operational")) {
    return "non-operational";
  }

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

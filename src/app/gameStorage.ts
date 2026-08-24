import { getEvent, getOutcome } from "../domain/events";
import { getNicknameKey } from "../domain/nicknames";
import { getTitleDefinition } from "../domain/titles";
import { getZoid } from "../domain/zoids";
import type {
  ActiveGameState,
  AppliedChange,
  CareerEndReason,
  CareerHistory,
  EventGameState,
  FinalGameState,
  Pilot,
  PilotCreationGameState,
  ResolvedYear,
  TitleId,
  ZoidId,
} from "../domain/types";

const gameStorageKey = "scars-of-steel:game-data";
const schemaVersion = 2;

const aspirations = ["commander", "shadow", "war-hero", "zoid-ace"] as const;
const careerEndReasons = [
  "dead",
  "disappeared",
  "no-eligible-events",
  "non-operational",
  "retired",
  "war-lost",
  "war-won",
] as const satisfies readonly CareerEndReason[];
const factions = ["guylos", "helic"] as const;
const militaryRanks = [
  "cadet",
  "captain",
  "commander",
  "corporal",
  "general",
  "lieutenant",
  "major",
  "sergeant",
  "soldier",
] as const;
const specialRanks = [
  "blitz-orbit",
  "eizen-dragoons",
  "leo-master",
  "machinery-four",
  "prozen-knight",
  "tactical-master",
  "traitor",
] as const;
const statNames = [
  "charisma",
  "piloting",
  "strength",
  "synchrony",
  "tactics",
  "technique",
] as const;
const warIntensities = ["active", "fierce", "low"] as const;

export interface CompletedGame {
  state: FinalGameState;
}

export interface StoredGameData {
  activeGame: ActiveGameState | null;
  completedGames: readonly CompletedGame[];
  version: typeof schemaVersion;
}

export function createCompletedGame(state: FinalGameState): CompletedGame {
  return { state };
}

export function createEmptyGameData(): StoredGameData {
  return { activeGame: null, completedGames: [], version: schemaVersion };
}

export function loadGameData(): StoredGameData {
  try {
    const storedValue = window.localStorage.getItem(gameStorageKey);
    const value: unknown = storedValue ? JSON.parse(storedValue) : null;

    return isStoredGameData(value) ? value : createEmptyGameData();
  } catch {
    return createEmptyGameData();
  }
}

export function saveGameData(data: StoredGameData): void {
  try {
    window.localStorage.setItem(gameStorageKey, JSON.stringify(data));
  } catch {
    // Storage must not block an in-memory game.
  }
}

function isStoredGameData(value: unknown): value is StoredGameData {
  return (
    isRecord(value) &&
    value.version === schemaVersion &&
    (value.activeGame === null || isActiveGame(value.activeGame)) &&
    Array.isArray(value.completedGames) &&
    value.completedGames.every(isCompletedGame)
  );
}

function isActiveGame(value: unknown): value is ActiveGameState {
  return (
    isPilotCreationGame(value) ||
    (isRecord(value) && value.screen === "event" && isEventGame(value))
  );
}

function isPilotCreationGame(value: unknown): value is PilotCreationGameState {
  return (
    isRecord(value) &&
    value.screen === "pilot-creation" &&
    isRecord(value.draft) &&
    isOptionalMember(value.draft.aspiration, aspirations) &&
    isOptionalMember(value.draft.faction, factions) &&
    typeof value.draft.name === "string"
  );
}

function isEventGame(value: Record<string, unknown>): boolean {
  if (
    !isKnownEventId(value.eventId) ||
    !isCareerHistory(value.history) ||
    !isPilot(value.pilot)
  ) {
    return false;
  }

  return value.phase === "choosing"
    ? value.result === undefined
    : (value.phase === "animating" || value.phase === "outcome") &&
        isResolvedYear(value.result, value.eventId);
}

function isCompletedGame(value: unknown): value is CompletedGame {
  return isRecord(value) && isFinalGameState(value.state);
}

function isFinalGameState(value: unknown): value is FinalGameState {
  if (
    !isRecord(value) ||
    value.screen !== "final" ||
    !isMember(value.endReason, careerEndReasons) ||
    !isCareerHistory(value.history) ||
    !isPilot(value.pilot) ||
    typeof value.nicknameId !== "string" ||
    !value.nicknameId.startsWith("nickname:") ||
    typeof value.titleId !== "string" ||
    !value.titleId.startsWith("title:")
  ) {
    return false;
  }

  try {
    getNicknameKey(value.nicknameId as `nickname:${string}`);
    getTitleDefinition(value.titleId as TitleId);
    return true;
  } catch {
    return false;
  }
}

function isCareerHistory(value: unknown): value is CareerHistory {
  return (
    isRecord(value) &&
    Array.isArray(value.achievementIds) &&
    value.achievementIds.every(
      (id) => typeof id === "string" && id.startsWith("achievement:"),
    ) &&
    isCareerBattles(value.battles) &&
    Array.isArray(value.completedEventIds) &&
    value.completedEventIds.every(isKnownEventId)
  );
}

function isCareerBattles(value: unknown): boolean {
  return (
    isRecord(value) &&
    ["losses", "participated", "wins"].every((key) =>
      isNonNegativeInteger(value[key]),
    )
  );
}

function isResolvedYear(
  value: unknown,
  eventId: EventGameState["eventId"],
): value is ResolvedYear {
  if (
    !isRecord(value) ||
    !Array.isArray(value.achievementIds) ||
    !value.achievementIds.every(
      (id) => typeof id === "string" && id.startsWith("achievement:"),
    ) ||
    !isBattleRecord(value.battleRecord) ||
    !Array.isArray(value.changes) ||
    !value.changes.every(isAppliedChange) ||
    !isPilot(value.pilotAfter) ||
    !isPilot(value.pilotBefore) ||
    !isResolution(value.resolution) ||
    !Array.isArray(value.zoidIds) ||
    !value.zoidIds.every(isKnownZoidId) ||
    !isRecord(value.outcome) ||
    typeof value.outcome.id !== "string"
  ) {
    return false;
  }

  try {
    const outcome = getOutcome(
      getEvent(eventId),
      value.outcome.id as `outcome:${string}`,
    );

    return JSON.stringify(value.outcome) === JSON.stringify(outcome);
  } catch {
    return false;
  }
}

function isBattleRecord(value: unknown): boolean {
  return (
    isRecord(value) &&
    ["assigned", "available", "losses", "participated", "wins"].every((key) =>
      isNonNegativeInteger(value[key]),
    ) &&
    ["injured", "killed", "zoidDamaged", "zoidDestroyed"].every(
      (key) => typeof value[key] === "boolean",
    )
  );
}

function isAppliedChange(value: unknown): value is AppliedChange {
  if (
    !isRecord(value) ||
    !isBoundedValue(value.current) ||
    !isBoundedValue(value.previous)
  ) {
    return false;
  }

  switch (value.target) {
    case "career-indicator":
      return value.indicator === "faction-trust" || value.indicator === "fame";
    case "potential":
      return true;
    case "stat":
      return isMember(value.stat, statNames);
    case "war-state":
      return isMember(value.faction, factions);
    default:
      return false;
  }
}

function isResolution(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.decisionId === "string" &&
    typeof value.outcomeId === "string" &&
    (value.kind === "safe" ||
      (value.kind === "chance" &&
        isBoundedValue(value.adjustedSuccessChance) &&
        isBoundedValue(value.roll) &&
        (value.result === "failure" || value.result === "success")))
  );
}

function isPilot(value: unknown): value is Pilot {
  return (
    isRecord(value) &&
    Number.isSafeInteger(value.age) &&
    isMember(value.aspiration, aspirations) &&
    isBoundedValue(value.basePotential) &&
    isRecord(value.career) &&
    isBoundedValue(value.career.factionTrust) &&
    isBoundedValue(value.career.fame) &&
    isMember(value.career.militaryRank, militaryRanks) &&
    isOptionalMember(value.career.specialRank, specialRanks) &&
    isWarState(value.career.warState) &&
    (value.condition === "active" ||
      value.condition === "dead" ||
      value.condition === "injured") &&
    isMember(value.faction, factions) &&
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isBoundedValue(value.potential) &&
    isStats(value.stats) &&
    isPilotZoids(value.zoids)
  );
}

function isStats(value: unknown): boolean {
  return (
    isRecord(value) && statNames.every((stat) => isBoundedValue(value[stat]))
  );
}

function isWarState(value: unknown): boolean {
  return (
    isRecord(value) &&
    isMember(value.intensity, warIntensities) &&
    Array.isArray(value.sides) &&
    value.sides.length === 2 &&
    value.sides.every(
      (side) =>
        isRecord(side) &&
        isBoundedValue(side.control) &&
        isMember(side.faction, factions),
    ) &&
    value.sides[0].faction !== value.sides[1].faction &&
    value.sides[0].control + value.sides[1].control === 100
  );
}

function isPilotZoids(value: unknown): boolean {
  return (
    value === null ||
    (isRecord(value) &&
      Array.isArray(value.damagedIds) &&
      value.damagedIds.every(isKnownZoidId) &&
      Array.isArray(value.reserveIds) &&
      value.reserveIds.every(isKnownZoidId) &&
      isKnownZoidId(value.signatureId))
  );
}

function isKnownEventId(value: unknown): value is `event:${string}` {
  if (typeof value !== "string" || !value.startsWith("event:")) {
    return false;
  }

  try {
    getEvent(value as `event:${string}`);
    return true;
  } catch {
    return false;
  }
}

function isKnownZoidId(value: unknown): value is ZoidId {
  if (typeof value !== "string" || !value.startsWith("zoid:")) {
    return false;
  }

  try {
    getZoid(value as ZoidId);
    return true;
  } catch {
    return false;
  }
}

function isBoundedValue(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 100;
}

function isNonNegativeInteger(value: unknown): boolean {
  return Number.isSafeInteger(value) && Number(value) >= 0;
}

function isMember<T extends string>(
  value: unknown,
  values: readonly T[],
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function isOptionalMember<T extends string>(
  value: unknown,
  values: readonly T[],
): value is T | null {
  return value === null || isMember(value, values);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

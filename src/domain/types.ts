declare const boundedValueBrand: unique symbol;
declare const warStateBrand: unique symbol;

export type AchievementId = `achievement:${string}`;
export type Aspiration = "commander" | "shadow" | "war-hero" | "zoid-ace";
export type BoundedValue = number & {
  readonly [boundedValueBrand]: "BoundedValue";
};
export type DecisionId = `decision:${string}`;
export type EventId = `event:${string}`;
export type Faction = "guylos" | "helic";
export type LifeStage =
  | "academy"
  | "early-service"
  | "elite-command"
  | "legacy"
  | "path-to-glory"
  | "soldier-life";
export type MilitaryRank =
  | "cadet"
  | "captain"
  | "commander"
  | "corporal"
  | "general"
  | "lieutenant"
  | "major"
  | "sergeant"
  | "soldier";
export type OutcomeId = `outcome:${string}`;
export type OutcomeTag = `outcome-tag:${string}`;
export type PilotId = `pilot:${string}`;
export type SpecialRank =
  | "blitz-orbit"
  | "eizen-dragoons"
  | "leo-master"
  | "machinery-four"
  | "prozen-knight"
  | "tactical-master"
  | "traitor";
export type StatName =
  "charisma" | "piloting" | "strength" | "synchrony" | "tactics" | "technique";
export type TranslationKey<
  Namespace extends TranslationNamespace = TranslationNamespace,
> = `${Namespace}:${string}`;
export type TranslationNamespace =
  | "achievements"
  | "decisions"
  | "interface"
  | "narrative"
  | "nicknames"
  | "outcomes"
  | "titles"
  | "zoids";
export type ZoidCategory = "rare" | "standard" | "super-rare" | "weak";
export type ZoidId = `zoid:${string}`;

export interface Stats {
  charisma: BoundedValue;
  piloting: BoundedValue;
  strength: BoundedValue;
  synchrony: BoundedValue;
  tactics: BoundedValue;
  technique: BoundedValue;
}

export interface WarState {
  guylos: BoundedValue;
  helic: BoundedValue;
  readonly [warStateBrand]: "WarState";
}

export interface MilitaryRankIndicator {
  id: MilitaryRank;
  kind: "military";
}

export interface SpecialRankIndicator {
  id: SpecialRank;
  kind: "special";
  militaryRank: MilitaryRank;
}

export type RankIndicator = MilitaryRankIndicator | SpecialRankIndicator;

export interface CareerIndicators {
  combatPower: BoundedValue;
  factionTrust: BoundedValue;
  fame: BoundedValue;
  rank: RankIndicator;
  warState: WarState;
}

export interface StoredCareerData {
  factionTrust: BoundedValue;
  fame: BoundedValue;
  militaryRank: MilitaryRank;
  specialRank: SpecialRank | null;
  warState: WarState;
}

interface PilotData {
  age: number;
  aspiration: Aspiration;
  baseCombatPower: BoundedValue;
  career: StoredCareerData;
  faction: Faction;
  id: PilotId;
  name: string;
  stats: Stats;
}

export interface PilotWithoutZoid extends PilotData {
  zoids: null;
}

export interface PilotWithZoid extends PilotData {
  zoids: {
    reserveIds: readonly ZoidId[];
    signatureId: ZoidId;
  };
}

export type Pilot = PilotWithoutZoid | PilotWithZoid;

export interface Zoid {
  basePower: BoundedValue;
  faction: Faction;
  id: ZoidId;
  imagePath?: string;
  nameKey: TranslationKey<"zoids">;
}

export type StatChange =
  | {
      amount: number;
      stat: StatName;
      target: "stat";
    }
  | {
      amount: number;
      indicator: "faction-trust" | "fame";
      target: "career-indicator";
    }
  | {
      amount: number;
      faction: Faction;
      target: "war-state";
    }
  | {
      amount: number;
      target: "base-combat-power";
    };

export interface Outcome {
  id: OutcomeId;
  narrativeKey: TranslationKey<"outcomes">;
  statChanges: readonly StatChange[];
  tags: readonly OutcomeTag[];
  zoidReward: ZoidCategory;
}

interface DecisionData {
  descriptionKey: TranslationKey<"decisions">;
  id: DecisionId;
  labelKey: TranslationKey<"decisions">;
}

export interface ProbabilityStat {
  stat: StatName;
  weight: number;
}

export interface ChanceDecision extends DecisionData {
  baseSuccessChance: BoundedValue;
  failureOutcome: Outcome;
  kind: "chance";
  outcome?: never;
  probabilityStats: readonly [ProbabilityStat, ...ProbabilityStat[]];
  successOutcome: Outcome;
}

export interface SafeDecision extends DecisionData {
  baseSuccessChance?: never;
  failureOutcome?: never;
  kind: "safe";
  outcome: Outcome;
  probabilityStats?: never;
  successOutcome?: never;
}

export type Decision = ChanceDecision | SafeDecision;

export interface DecisionEvent {
  decisions: readonly [Decision, Decision, Decision];
  id: EventId;
  introductionKey: TranslationKey<"narrative">;
  titleKey: TranslationKey<"narrative">;
}

export interface SafeDecisionResolution {
  decisionId: DecisionId;
  kind: "safe";
  outcomeId: OutcomeId;
}

export interface ChanceDecisionResolution {
  adjustedSuccessChance: BoundedValue;
  decisionId: DecisionId;
  kind: "chance";
  outcomeId: OutcomeId;
  result: "failure" | "success";
  roll: BoundedValue;
}

export type DecisionResolution =
  ChanceDecisionResolution | SafeDecisionResolution;

export interface BattleRecord {
  assigned: number;
  losses: number;
  wins: number;
}

export interface PilotDraft {
  aspiration: Aspiration | null;
  faction: Faction | null;
  name: string;
}

export interface WelcomeGameState {
  screen: "welcome";
}

export interface PilotCreationGameState {
  draft: PilotDraft;
  screen: "pilot-creation";
}

export interface ChoosingEventGameState {
  eventId: EventId;
  phase: "choosing";
  pilot: PilotWithoutZoid;
  screen: "event";
}

export interface ResolvingEventGameState {
  eventId: EventId;
  phase: "resolving";
  pilot: PilotWithoutZoid;
  resolution: DecisionResolution;
  screen: "event";
}

export interface OutcomeGameState {
  battleRecord: BattleRecord;
  eventId: EventId;
  pilot: PilotWithZoid;
  resolution: DecisionResolution;
  screen: "outcome";
}

export interface FinalGameState {
  achievementIds: readonly AchievementId[];
  eventId: EventId;
  nicknameKey: TranslationKey<"nicknames">;
  pilot: PilotWithZoid;
  resolution: DecisionResolution;
  screen: "final";
  titleKey: TranslationKey<"titles">;
}

export type GameState =
  | ChoosingEventGameState
  | FinalGameState
  | OutcomeGameState
  | PilotCreationGameState
  | ResolvingEventGameState
  | WelcomeGameState;

export function createBoundedValue(value: number): BoundedValue {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("The value must be a finite number from 0 to 100.");
  }

  return value as BoundedValue;
}

export function createWarState(helic: number, guylos: number): WarState {
  const helicControl = createBoundedValue(helic);
  const guylosControl = createBoundedValue(guylos);

  if (helicControl + guylosControl !== 100) {
    throw new RangeError("Faction control values must total 100.");
  }

  return {
    guylos: guylosControl,
    helic: helicControl,
  } as WarState;
}

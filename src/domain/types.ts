declare const boundedValueBrand: unique symbol;
declare const warStateBrand: unique symbol;

export type AchievementId =
  | "achievement:born-in-workshop"
  | "achievement:first-romance"
  | "achievement:not-on-my-watch"
  | "achievement:snitch"
  | "achievement:true-soldier";
export type Aspiration = "commander" | "shadow" | "war-hero" | "zoid-ace";
export type BoundedValue = number & {
  readonly [boundedValueBrand]: "BoundedValue";
};
export type CareerEndReason =
  | "dead"
  | "disappeared"
  | "no-eligible-events"
  | "non-operational"
  | "retired"
  | "war-lost"
  | "war-won";
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
export type NicknameId = `nickname:${string}`;
export type OutcomeId = `outcome:${string}`;
export type PilotCondition = "active" | "dead" | "injured";
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
export type TitleId =
  | "title:champion"
  | "title:false-promise"
  | "title:living-legend"
  | "title:martyr"
  | "title:nation-ace"
  | "title:nation-idol"
  | "title:puppeteer"
  | "title:solid-pilot"
  | "title:spear-of-zi"
  | "title:veteran"
  | "title:village-hero"
  | "title:voice-of-command"
  | "title:war-hero";
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
export type WarIntensity = "active" | "fierce" | "low";
export type ZoidCategory = "rare" | "standard" | "super-rare" | "weak";
export type ZoidId = `zoid:${string}`;
export type ZoidPoolId =
  ZoidCategory | "herd" | "aerial-academy" | "academy-replacement";
export type BonusId = "organoid";

export interface Stats {
  charisma: BoundedValue;
  piloting: BoundedValue;
  strength: BoundedValue;
  synchrony: BoundedValue;
  tactics: BoundedValue;
  technique: BoundedValue;
}

export interface WarFactionState {
  control: BoundedValue;
  faction: Faction;
}

export interface WarState {
  intensity: WarIntensity;
  sides: readonly [WarFactionState, WarFactionState];
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
  factionTrust: BoundedValue;
  fame: BoundedValue;
  potential: BoundedValue;
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
  basePotential: BoundedValue;
  bonusIds?: readonly BonusId[];
  career: StoredCareerData;
  condition: PilotCondition;
  faction: Faction;
  id: PilotId;
  injuryCount?: number;
  name: string;
  potential: BoundedValue;
  stats: Stats;
  zoidProgress?: Readonly<
    Partial<Record<ZoidId, { power: BoundedValue; upgrades: number }>>
  >;
}

export interface PilotWithoutZoid extends PilotData {
  zoids: null;
}

export interface PilotWithZoid extends PilotData {
  zoids: {
    damagedIds: readonly ZoidId[];
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

export type OutcomeEffect =
  | {
      amount: number;
      kind: "change-stat";
      stat: StatName;
    }
  | {
      amount: number;
      indicator: "faction-trust" | "fame";
      kind: "change-career-indicator";
    }
  | {
      amount: number;
      faction: Faction;
      kind: "change-war-control";
    }
  | {
      amount: number;
      kind: "change-potential";
    }
  | {
      amount: number;
      kind: "change-zoid-power";
    }
  | {
      amount: number;
      kind: "change-zoid-upgrades";
    }
  | {
      achievementId: AchievementId;
      kind: "grant-achievement";
    }
  | {
      bonusId: BonusId;
      kind: "grant-bonus";
    }
  | {
      kind: "grant-zoid";
      poolId: ZoidPoolId;
    }
  | {
      kind: "replace-signature-zoid";
      poolId: ZoidPoolId;
    }
  | {
      kind: "damage-signature-zoid";
    }
  | {
      kind: "injure-pilot";
    }
  | {
      kind: "kill-pilot";
    }
  | {
      kind: "remove-zoid";
      zoidId: ZoidId;
    }
  | {
      kind: "end-career";
      reason: Exclude<CareerEndReason, "dead" | "no-eligible-events">;
    };

export interface Outcome {
  effects: readonly OutcomeEffect[];
  id: OutcomeId;
  narrativeKey: TranslationKey<"outcomes">;
}

interface DecisionData {
  descriptionKey: TranslationKey<"decisions">;
  id: DecisionId;
  labelKey: TranslationKey<"decisions">;
}

export interface ProbabilityStat {
  stat: StatName | "potential";
  weight: number;
}

export interface ChanceDecision extends DecisionData {
  baseSuccessChance: BoundedValue;
  failureOutcomeId: OutcomeId;
  kind: "chance";
  outcome?: never;
  probabilityNeutralStat?: BoundedValue;
  probabilityStats: readonly [ProbabilityStat, ...ProbabilityStat[]];
  successOutcomeId: OutcomeId;
}

export interface SafeDecision extends DecisionData {
  baseSuccessChance?: never;
  failureOutcomeId?: never;
  kind: "safe";
  outcomeId: OutcomeId;
  probabilityNeutralStat?: never;
  probabilityStats?: never;
  successOutcomeId?: never;
}

export type Decision = ChanceDecision | SafeDecision;

export interface DecisionEvent {
  ages?: readonly number[];
  decisions: readonly [Decision, Decision, Decision];
  id: EventId;
  factions?: readonly Faction[];
  requiresZoid?: boolean;
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
  available: number;
  injured: boolean;
  killed: boolean;
  losses: number;
  participated: number;
  wins: number;
  zoidDamaged: boolean;
  zoidDestroyed: boolean;
}

export interface CareerBattleRecord {
  losses: number;
  participated: number;
  wins: number;
}

export interface CareerHistory {
  achievementIds: readonly AchievementId[];
  battles: CareerBattleRecord;
  completedEventIds: readonly EventId[];
}

export type AppliedChange =
  | {
      current: number;
      previous: number;
      target: "zoid-power" | "zoid-upgrades";
      zoidId: ZoidId;
    }
  | {
      current: BoundedValue;
      previous: BoundedValue;
      stat: StatName;
      target: "stat";
    }
  | {
      current: BoundedValue;
      indicator: "faction-trust" | "fame";
      previous: BoundedValue;
      target: "career-indicator";
    }
  | {
      current: BoundedValue;
      faction: Faction;
      previous: BoundedValue;
      target: "war-state";
    }
  | {
      current: BoundedValue;
      previous: BoundedValue;
      target: "potential";
    };

export interface ResolvedYear {
  annualReport?: AnnualReport;
  achievementIds: readonly AchievementId[];
  battleRecord: BattleRecord;
  changes: readonly AppliedChange[];
  outcome: Outcome;
  pilotAfter: Pilot;
  pilotBefore: Pilot;
  resolution: DecisionResolution;
  zoidIds: readonly ZoidId[];
}

export interface AnnualRoll {
  chance: number;
  roll: number;
  success: boolean;
  kind: "death" | "recovery" | "repair";
  zoidId?: ZoidId;
}

export interface AnnualReport {
  bonusIds: readonly BonusId[];
  growth: number;
  injured: boolean;
  promoted: boolean;
  rolls: readonly AnnualRoll[];
  zoidDamaged: boolean;
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
  history: CareerHistory;
  phase: "choosing";
  pilot: Pilot;
  screen: "event";
}

export interface AnimatingEventGameState {
  eventId: EventId;
  history: CareerHistory;
  phase: "animating";
  pilot: Pilot;
  result: ResolvedYear & {
    resolution: ChanceDecisionResolution;
  };
  screen: "event";
}

export interface OutcomeEventGameState {
  eventId: EventId;
  history: CareerHistory;
  phase: "outcome";
  pilot: Pilot;
  result: ResolvedYear;
  screen: "event";
}

export type EventGameState =
  AnimatingEventGameState | ChoosingEventGameState | OutcomeEventGameState;

export interface FinalGameState {
  endReason: CareerEndReason;
  history: CareerHistory;
  nicknameId: NicknameId;
  pilot: Pilot;
  screen: "final";
  titleId: TitleId;
}

export type GameState =
  EventGameState | FinalGameState | PilotCreationGameState | WelcomeGameState;

export type ActiveGameState = EventGameState | PilotCreationGameState;

export function createBoundedValue(value: number): BoundedValue {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new RangeError("The value must be a finite number from 0 to 100.");
  }

  return value as BoundedValue;
}

export function createWarState(
  firstFaction: Faction,
  firstControl: number,
  secondFaction: Faction,
  secondControl: number,
  intensity: WarIntensity = "low",
): WarState {
  const first = createBoundedValue(firstControl);
  const second = createBoundedValue(secondControl);

  if (firstFaction === secondFaction) {
    throw new RangeError("War factions must be different.");
  }

  if (first + second !== 100) {
    throw new RangeError("Faction control values must total 100.");
  }

  return {
    intensity,
    sides: [
      { control: first, faction: firstFaction },
      { control: second, faction: secondFaction },
    ],
  } as unknown as WarState;
}

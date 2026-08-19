import {
  createBoundedValue,
  createWarState,
  type Aspiration,
  type Faction,
  type LifeStage,
  type PilotId,
  type PilotWithoutZoid,
  type StatName,
  type Stats,
  type TranslationKey,
} from "./types";

const initialStats = {
  commander: {
    charisma: 5,
    piloting: 2,
    strength: 3,
    synchrony: 3,
    tactics: 4,
    technique: 3,
  },
  shadow: {
    charisma: 2,
    piloting: 4,
    strength: 3,
    synchrony: 3,
    tactics: 5,
    technique: 3,
  },
  "war-hero": {
    charisma: 3,
    piloting: 5,
    strength: 4,
    synchrony: 2,
    tactics: 3,
    technique: 3,
  },
  "zoid-ace": {
    charisma: 3,
    piloting: 3,
    strength: 2,
    synchrony: 5,
    tactics: 3,
    technique: 4,
  },
} as const satisfies Record<Aspiration, Record<StatName, number>>;

export const aspirationNameKeys = {
  commander: "interface:aspirations.commander",
  shadow: "interface:aspirations.shadow",
  "war-hero": "interface:aspirations.warHero",
  "zoid-ace": "interface:aspirations.zoidAce",
} as const satisfies Record<Aspiration, TranslationKey<"interface">>;

export const factionNameKeys = {
  guylos: "interface:factions.guylos",
  helic: "interface:factions.helic",
} as const satisfies Record<Faction, TranslationKey<"interface">>;

export const lifeStageNameKeys = {
  academy: "interface:careerStatus.lifeStages.academy",
  "early-service": "interface:careerStatus.lifeStages.earlyService",
  "elite-command": "interface:careerStatus.lifeStages.eliteCommand",
  legacy: "interface:careerStatus.lifeStages.legacy",
  "path-to-glory": "interface:careerStatus.lifeStages.pathToGlory",
  "soldier-life": "interface:careerStatus.lifeStages.soldierLife",
} as const satisfies Record<LifeStage, TranslationKey<"interface">>;

export interface InitialPilotData {
  aspiration: Aspiration;
  faction: Faction;
  id: PilotId;
  name: string;
}

export function createInitialPilot({
  aspiration,
  faction,
  id,
  name,
}: InitialPilotData): PilotWithoutZoid {
  const zero = createBoundedValue(0);

  return {
    age: 12,
    aspiration,
    baseCombatPower: zero,
    career: {
      factionTrust: zero,
      fame: zero,
      militaryRank: "cadet",
      specialRank: null,
      warState: createWarState(50, 50),
    },
    faction,
    id,
    name: normalizePilotName(name),
    stats: getInitialStats(aspiration),
    zoids: null,
  };
}

export function normalizePilotName(name: string): string {
  const normalizedName = name.normalize().trim().replace(/\s+/gu, " ");

  if (!normalizedName) {
    throw new TypeError("Pilot name must not be empty.");
  }

  return normalizedName;
}

export function getInitialStats(aspiration: Aspiration): Stats {
  const stats = initialStats[aspiration];

  return {
    charisma: createBoundedValue(stats.charisma),
    piloting: createBoundedValue(stats.piloting),
    strength: createBoundedValue(stats.strength),
    synchrony: createBoundedValue(stats.synchrony),
    tactics: createBoundedValue(stats.tactics),
    technique: createBoundedValue(stats.technique),
  };
}

export function getLifeStage(age: number): LifeStage {
  if (age < 15) {
    return "academy";
  }

  if (age < 21) {
    return "early-service";
  }

  if (age < 26) {
    return "soldier-life";
  }

  if (age < 35) {
    return "path-to-glory";
  }

  return age < 45 ? "elite-command" : "legacy";
}

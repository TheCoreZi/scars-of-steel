import {
  createBoundedValue,
  createWarState,
  type Aspiration,
  type Faction,
  type LifeStage,
  type MilitaryRank,
  type Pilot,
  type PilotId,
  type PilotWithoutZoid,
  type SpecialRank,
  type StatName,
  type Stats,
  type TranslationKey,
} from "./types";
import { getZoid } from "./zoids";

const zoidPotentialWeight = 0.25;
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

export const battleFactionNameKeys = {
  guylos: "interface:outcomeScreen.factions.guylos",
  helic: "interface:outcomeScreen.factions.helic",
} as const satisfies Record<Faction, TranslationKey<"interface">>;

export const factionNameKeys = {
  guylos: "interface:factions.guylos",
  helic: "interface:factions.helic",
} as const satisfies Record<Faction, TranslationKey<"interface">>;

export const factionShortNameKeys = {
  guylos: "interface:careerStatus.factions.guylos",
  helic: "interface:careerStatus.factions.helic",
} as const satisfies Record<Faction, TranslationKey<"interface">>;

export const lifeStageNameKeys = {
  academy: "interface:careerStatus.lifeStages.academy",
  "early-service": "interface:careerStatus.lifeStages.earlyService",
  "elite-command": "interface:careerStatus.lifeStages.eliteCommand",
  legacy: "interface:careerStatus.lifeStages.legacy",
  "path-to-glory": "interface:careerStatus.lifeStages.pathToGlory",
  "soldier-life": "interface:careerStatus.lifeStages.soldierLife",
} as const satisfies Record<LifeStage, TranslationKey<"interface">>;

export const militaryRankNameKeys = {
  cadet: "interface:careerStatus.ranks.cadet",
  captain: "interface:careerStatus.ranks.captain",
  commander: "interface:careerStatus.ranks.commander",
  corporal: "interface:careerStatus.ranks.corporal",
  general: "interface:careerStatus.ranks.general",
  lieutenant: "interface:careerStatus.ranks.lieutenant",
  major: "interface:careerStatus.ranks.major",
  sergeant: "interface:careerStatus.ranks.sergeant",
  soldier: "interface:careerStatus.ranks.soldier",
} as const satisfies Record<MilitaryRank, TranslationKey<"interface">>;

export const specialRankNameKeys = {
  "blitz-orbit": "interface:careerStatus.specialRanks.blitzOrbit",
  "eizen-dragoons": "interface:careerStatus.specialRanks.eizenDragoons",
  "leo-master": "interface:careerStatus.specialRanks.leoMaster",
  "machinery-four": "interface:careerStatus.specialRanks.machineryFour",
  "prozen-knight": "interface:careerStatus.specialRanks.prozenKnight",
  "tactical-master": "interface:careerStatus.specialRanks.tacticalMaster",
  traitor: "interface:careerStatus.specialRanks.traitor",
} as const satisfies Record<SpecialRank, TranslationKey<"interface">>;

export const statNameKeys = {
  charisma: "interface:pilotCreation.stats.charisma",
  piloting: "interface:pilotCreation.stats.piloting",
  strength: "interface:pilotCreation.stats.strength",
  synchrony: "interface:pilotCreation.stats.synchrony",
  tactics: "interface:pilotCreation.stats.tactics",
  technique: "interface:pilotCreation.stats.technique",
} as const satisfies Record<StatName, TranslationKey<"interface">>;

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
    basePotential: zero,
    career: {
      factionTrust: zero,
      fame: zero,
      militaryRank: "cadet",
      specialRank: null,
      warState: createWarState("helic", 50, "guylos", 50),
    },
    condition: "active",
    faction,
    id,
    name: normalizePilotName(name),
    potential: zero,
    stats: getInitialStats(aspiration),
    zoids: null,
  };
}

export function calculatePotential(pilot: Pilot) {
  const zoidBonus = pilot.zoids
    ? getZoid(pilot.zoids.signatureId).basePower * zoidPotentialWeight
    : 0;

  return createBoundedValue(
    Math.min(100, Math.round(pilot.basePotential + zoidBonus)),
  );
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

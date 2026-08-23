import {
  achievementDescriptionKeys,
  achievementNameKeys,
  getAchievementIconPath,
} from "./achievements";
import { getNicknameKey } from "./nicknames";
import {
  factionNameKeys,
  militaryRankNameKeys,
  specialRankNameKeys,
  statNameKeys,
} from "./pilot";
import { getRankInsignia, type RankInsigniaDefinition } from "./ranks";
import { getTitleDefinition } from "./titles";
import type { Faction, FinalGameState, StatName } from "./types";
import { getZoid } from "./zoids";
import { translate } from "../i18n";

const finalFactionNameKeys = {
  guylos: "interface:finalScreen.factions.guylos",
  helic: "interface:finalScreen.factions.helic",
} as const satisfies Record<Faction, `interface:${string}`>;

const statNames = [
  "charisma",
  "piloting",
  "strength",
  "synchrony",
  "tactics",
  "technique",
] as const satisfies readonly StatName[];

export interface FinalAchievementSummary {
  description: string;
  iconPath: string;
  name: string;
}

export interface FinalStatSummary {
  label: string;
  value: number;
}

export interface FinalSummary {
  achievements: readonly FinalAchievementSummary[];
  age: number;
  ageLabel: string;
  battleLosses: number;
  battleWins: number;
  faction: Faction;
  factionImagePath: string;
  factionName: string;
  factionTrust: number;
  fame: number;
  labels: {
    achievements: string;
    battleRecord: string;
    factionTrust: string;
    fame: string;
    losses: string;
    potential: string;
    stats: string;
    wins: string;
    zoid: string;
  };
  pilotName: string;
  potential: number;
  rank: string;
  rankInsignia: RankInsigniaDefinition;
  stats: readonly FinalStatSummary[];
  titleDescription: string;
  titleIconPath: string;
  titleName: string;
  zoidImagePath?: string;
  zoidName: string;
}

export function createFinalSummary(state: FinalGameState): FinalSummary {
  const careerYears = Math.max(0, state.pilot.age - 12);
  const nickname = translate(getNicknameKey(state.nicknameId));
  const pilotName = translate("interface:finalScreen.pilotName", {
    faction: translate(finalFactionNameKeys[state.pilot.faction]),
    name: state.pilot.name,
    nickname,
  });
  const title = getTitleDefinition(state.titleId);
  const zoid = state.pilot.zoids
    ? getZoid(state.pilot.zoids.signatureId)
    : null;

  return {
    achievements: state.history.achievementIds.map((id) => ({
      description: translate(achievementDescriptionKeys[id]),
      iconPath: getAchievementIconPath(id),
      name: translate(achievementNameKeys[id]),
    })),
    age: state.pilot.age,
    ageLabel: translate("interface:finalScreen.careerDuration", {
      age: state.pilot.age,
      count: careerYears,
    }),
    battleLosses: state.history.battles.losses,
    battleWins: state.history.battles.wins,
    faction: state.pilot.faction,
    factionImagePath: `/images/factions/${state.pilot.faction}.png`,
    factionName: translate(factionNameKeys[state.pilot.faction]),
    factionTrust: state.pilot.career.factionTrust,
    fame: state.pilot.career.fame,
    labels: {
      achievements: translate("interface:finalScreen.achievements"),
      battleRecord: translate("interface:finalScreen.battleRecord"),
      factionTrust: translate("interface:finalScreen.factionTrust"),
      fame: translate("interface:finalScreen.fame"),
      losses: translate("interface:finalScreen.losses"),
      potential: translate("interface:finalScreen.potential"),
      stats: translate("interface:finalScreen.stats"),
      wins: translate("interface:finalScreen.wins"),
      zoid: translate("interface:finalScreen.zoid"),
    },
    pilotName: state.pilot.name,
    potential: state.pilot.potential,
    rank: getVisibleRankName(state),
    rankInsignia: getRankInsignia(state.pilot.career.militaryRank),
    stats: statNames.map((stat) => ({
      label: translate(statNameKeys[stat]),
      value: state.pilot.stats[stat],
    })),
    titleDescription: translate(title.descriptionKey, { pilotName }),
    titleIconPath: title.iconPath,
    titleName: translate(title.nameKey),
    zoidImagePath: zoid?.imagePath,
    zoidName: zoid
      ? translate(zoid.nameKey)
      : translate("interface:finalScreen.noZoid"),
  };
}

function getVisibleRankName(state: FinalGameState): string {
  const { career } = state.pilot;

  return career.specialRank
    ? translate(specialRankNameKeys[career.specialRank])
    : translate(militaryRankNameKeys[career.militaryRank]);
}

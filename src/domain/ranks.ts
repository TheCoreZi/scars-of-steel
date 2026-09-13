import { getAssetPath } from "../assets";
import { createBoundedValue, type MilitaryRank, type Pilot } from "./types";

export interface RankInsigniaDefinition {
  imagePath: string;
}

export const militaryRankLevels = {
  cadet: 0,
  captain: 50,
  commander: 70,
  corporal: 20,
  general: 80,
  lieutenant: 40,
  major: 60,
  private: 10,
  sergeant: 30,
} as const satisfies Record<MilitaryRank, number>;

export const rankInsigniaDefinitions = {
  cadet: { imagePath: getAssetPath("images/ranks/cadet.png") },
  captain: { imagePath: getAssetPath("images/ranks/captain.png") },
  commander: { imagePath: getAssetPath("images/ranks/commander.png") },
  corporal: { imagePath: getAssetPath("images/ranks/corporal.png") },
  general: { imagePath: getAssetPath("images/ranks/general.png") },
  lieutenant: { imagePath: getAssetPath("images/ranks/lieutenant.png") },
  major: { imagePath: getAssetPath("images/ranks/major.png") },
  private: { imagePath: getAssetPath("images/ranks/soldier.png") },
  sergeant: { imagePath: getAssetPath("images/ranks/sergeant.png") },
} as const satisfies Record<MilitaryRank, RankInsigniaDefinition>;

const militaryRankOrder = [
  "cadet",
  "private",
  "corporal",
  "sergeant",
  "lieutenant",
  "captain",
  "major",
  "commander",
  "general",
] as const satisfies readonly MilitaryRank[];

export function getRankInsignia(rank: MilitaryRank): RankInsigniaDefinition {
  return rankInsigniaDefinitions[rank];
}

export function hasMinimumRank(
  rank: MilitaryRank,
  minimum: MilitaryRank,
): boolean {
  return militaryRankLevels[rank] >= militaryRankLevels[minimum];
}

export function promotePilot(pilot: Pilot): Pilot {
  const militaryRank = promoteMilitaryRank(pilot.career.militaryRank);
  return militaryRank === pilot.career.militaryRank
    ? pilot
    : {
        ...pilot,
        career: {
          ...pilot.career,
          factionTrust: createBoundedValue(
            Math.min(100, pilot.career.factionTrust + 5),
          ),
          militaryRank,
        },
      };
}

export function promoteMilitaryRank(rank: MilitaryRank): MilitaryRank {
  return militaryRankOrder[militaryRankOrder.indexOf(rank) + 1] ?? rank;
}

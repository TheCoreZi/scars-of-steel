import { getAssetPath } from "../assets";
import type { MilitaryRank } from "./types";

export interface RankInsigniaDefinition {
  imagePath: string;
}

export const rankInsigniaDefinitions = {
  cadet: { imagePath: getAssetPath("images/ranks/cadet.png") },
  captain: { imagePath: getAssetPath("images/ranks/captain.png") },
  commander: { imagePath: getAssetPath("images/ranks/commander.png") },
  corporal: { imagePath: getAssetPath("images/ranks/corporal.png") },
  general: { imagePath: getAssetPath("images/ranks/general.png") },
  lieutenant: { imagePath: getAssetPath("images/ranks/lieutenant.png") },
  major: { imagePath: getAssetPath("images/ranks/major.png") },
  sergeant: { imagePath: getAssetPath("images/ranks/sergeant.png") },
  soldier: { imagePath: getAssetPath("images/ranks/soldier.png") },
} as const satisfies Record<MilitaryRank, RankInsigniaDefinition>;

export function getRankInsignia(rank: MilitaryRank): RankInsigniaDefinition {
  return rankInsigniaDefinitions[rank];
}

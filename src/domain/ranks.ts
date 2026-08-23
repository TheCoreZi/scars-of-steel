import type { MilitaryRank } from "./types";

export interface RankInsigniaDefinition {
  imagePath: string;
}

export const rankInsigniaDefinitions = {
  cadet: { imagePath: "/images/ranks/cadet.png" },
  captain: { imagePath: "/images/ranks/captain.png" },
  commander: { imagePath: "/images/ranks/commander.png" },
  corporal: { imagePath: "/images/ranks/corporal.png" },
  general: { imagePath: "/images/ranks/general.png" },
  lieutenant: { imagePath: "/images/ranks/lieutenant.png" },
  major: { imagePath: "/images/ranks/major.png" },
  sergeant: { imagePath: "/images/ranks/sergeant.png" },
  soldier: { imagePath: "/images/ranks/soldier.png" },
} as const satisfies Record<MilitaryRank, RankInsigniaDefinition>;

export function getRankInsignia(rank: MilitaryRank): RankInsigniaDefinition {
  return rankInsigniaDefinitions[rank];
}

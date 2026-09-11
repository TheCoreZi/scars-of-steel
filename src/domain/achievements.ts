import { getAssetPath } from "../assets";
import type { AchievementId, TranslationKey } from "./types";

export type AchievementIconId = "gavel" | "heart" | "whistle" | "wrench";

export interface AchievementDefinition {
  descriptionKey: TranslationKey<"achievements">;
  iconId: AchievementIconId;
  nameKey: TranslationKey<"achievements">;
}

export const achievementCatalog = {
  "achievement:born-in-workshop": {
    descriptionKey: "achievements:bornInWorkshop.description",
    iconId: "wrench",
    nameKey: "achievements:bornInWorkshop.name",
  },
  "achievement:first-romance": {
    descriptionKey: "achievements:firstRomance.description",
    iconId: "heart",
    nameKey: "achievements:firstRomance.name",
  },
  "achievement:not-on-my-watch": {
    descriptionKey: "achievements:notOnMyWatch.description",
    iconId: "gavel",
    nameKey: "achievements:notOnMyWatch.name",
  },
  "achievement:snitch": {
    descriptionKey: "achievements:snitch.description",
    iconId: "whistle",
    nameKey: "achievements:snitch.name",
  },
  "achievement:true-soldier": {
    descriptionKey: "achievements:trueSoldier.description",
    iconId: "heart",
    nameKey: "achievements:trueSoldier.name",
  },
} as const satisfies Record<AchievementId, AchievementDefinition>;

export function getAchievementIconPath(id: AchievementId): string {
  return getAssetPath(
    `images/icons/achievements/${achievementCatalog[id].iconId}.svg`,
  );
}

import type { AchievementId, TranslationKey } from "./types";

export type AchievementIconId = "gavel" | "heart" | "wrench";

export const achievementDescriptionKeys = {
  "achievement:born-in-workshop": "achievements:bornInWorkshop.description",
  "achievement:not-on-my-watch": "achievements:notOnMyWatch.description",
  "achievement:true-soldier": "achievements:trueSoldier.description",
} as const satisfies Record<AchievementId, TranslationKey<"achievements">>;

export const achievementIconIds = {
  "achievement:born-in-workshop": "wrench",
  "achievement:not-on-my-watch": "gavel",
  "achievement:true-soldier": "heart",
} as const satisfies Record<AchievementId, AchievementIconId>;

export const achievementNameKeys = {
  "achievement:born-in-workshop": "achievements:bornInWorkshop.name",
  "achievement:not-on-my-watch": "achievements:notOnMyWatch.name",
  "achievement:true-soldier": "achievements:trueSoldier.name",
} as const satisfies Record<AchievementId, TranslationKey<"achievements">>;

export function getAchievementIconPath(id: AchievementId): string {
  return `/images/icons/achievements/${achievementIconIds[id]}.svg`;
}

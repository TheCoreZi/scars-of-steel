import type { AchievementId, TranslationKey } from "./types";

export const achievementNameKeys = {
  "achievement:born-in-workshop": "achievements:bornInWorkshop.name",
  "achievement:not-on-my-watch": "achievements:notOnMyWatch.name",
  "achievement:true-soldier": "achievements:trueSoldier.name",
} as const satisfies Record<AchievementId, TranslationKey<"achievements">>;

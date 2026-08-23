import type {
  CareerEndReason,
  CareerHistory,
  Pilot,
  TitleId,
  TranslationKey,
} from "./types";

export interface TitleGrantContext {
  endReason: CareerEndReason;
  history: CareerHistory;
  pilot: Pilot;
}

export interface TitleDefinition {
  canBeGranted: (context: TitleGrantContext) => boolean;
  descriptionKey: TranslationKey<"titles">;
  iconPath: string;
  id: TitleId;
  nameKey: TranslationKey<"titles">;
}

function isHighRank(pilot: Pilot): boolean {
  return ["general", "major"].includes(pilot.career.militaryRank);
}

function titleDefinition(
  id: TitleId,
  key: string,
  canBeGranted: TitleDefinition["canBeGranted"],
): TitleDefinition {
  return {
    canBeGranted,
    descriptionKey: `titles:${key}.description`,
    id,
    iconPath: `/images/icons/titles/${id.slice("title:".length)}.png`,
    nameKey: `titles:${key}.name`,
  };
}

export const titleCatalog = [
  titleDefinition(
    "title:martyr",
    "martyr",
    ({ endReason, pilot }) => endReason === "dead" && pilot.career.fame >= 80,
  ),
  titleDefinition(
    "title:champion",
    "champion",
    ({ endReason }) => endReason === "war-won",
  ),
  titleDefinition(
    "title:solid-pilot",
    "solidPilot",
    ({ endReason, pilot }) =>
      endReason === "war-lost" && pilot.condition !== "dead",
  ),
  titleDefinition(
    "title:false-promise",
    "falsePromise",
    ({ pilot }) => pilot.age < 15,
  ),
  titleDefinition(
    "title:puppeteer",
    "puppeteer",
    ({ pilot }) => pilot.career.specialRank === "traitor",
  ),
  titleDefinition(
    "title:veteran",
    "veteran",
    ({ endReason, pilot }) => endReason === "retired" && pilot.age >= 50,
  ),
  titleDefinition(
    "title:living-legend",
    "livingLegend",
    ({ pilot }) => pilot.potential > 90 && isHighRank(pilot),
  ),
  titleDefinition(
    "title:voice-of-command",
    "voiceOfCommand",
    ({ pilot }) => pilot.career.militaryRank === "general",
  ),
  titleDefinition(
    "title:nation-idol",
    "nationIdol",
    ({ pilot }) => pilot.career.fame >= 90,
  ),
  titleDefinition(
    "title:war-hero",
    "warHero",
    ({ pilot }) => pilot.potential >= 90,
  ),
  titleDefinition(
    "title:spear-of-zi",
    "spearOfZi",
    ({ history }) =>
      history.battles.participated > 0 &&
      history.battles.wins / history.battles.participated >= 0.8,
  ),
  titleDefinition(
    "title:nation-ace",
    "nationAce",
    ({ pilot }) => pilot.career.factionTrust >= 90,
  ),
  titleDefinition("title:village-hero", "villageHero", () => true),
] as const satisfies readonly TitleDefinition[];

export function getTitleDefinition(titleId: TitleId): TitleDefinition {
  const title = titleCatalog.find(({ id }) => id === titleId);

  if (!title) {
    throw new RangeError(`Unknown title identifier: ${titleId}.`);
  }

  return title;
}

export function selectTitle(
  pilot: Pilot,
  history: CareerHistory,
  endReason: CareerEndReason,
): TitleId {
  const context = { endReason, history, pilot };
  const title = titleCatalog.find(({ canBeGranted }) => canBeGranted(context));

  if (!title) {
    throw new TypeError("The title catalog must define a fallback title.");
  }

  return title.id;
}

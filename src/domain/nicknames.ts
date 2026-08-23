import type { RandomGenerator } from "./random";
import type { NicknameId, StatName, Stats, TranslationKey } from "./types";

export interface NicknamePoolDefinition {
  canBeGranted: (stats: Stats) => boolean;
  nicknames: readonly NicknameId[];
  stat: StatName;
}

const defaultPool = [
  "nickname:board",
  "nickname:buzzard",
  "nickname:claw",
  "nickname:dog",
  "nickname:fang",
  "nickname:fury",
  "nickname:guardian",
  "nickname:handless",
  "nickname:hunter",
  "nickname:meteor",
  "nickname:raven",
  "nickname:roar",
  "nickname:sentinel",
  "nickname:shadow",
  "nickname:thunder",
  "nickname:viper",
  "nickname:wanderer",
  "nickname:weirdo",
] as const satisfies readonly NicknameId[];

function nicknamePool(
  stat: StatName,
  nicknames: readonly NicknameId[],
): NicknamePoolDefinition {
  return { canBeGranted: (stats) => stats[stat] >= 80, nicknames, stat };
}

export const nicknamePoolCatalog = [
  nicknamePool("charisma", [
    "nickname:banner",
    "nickname:heart",
    "nickname:star",
    "nickname:symbol",
    "nickname:voice",
  ]),
  nicknamePool("piloting", [
    "nickname:ace",
    "nickname:colossus",
    "nickname:demon",
    "nickname:knight",
    "nickname:sword",
  ]),
  nicknamePool("strength", [
    "nickname:beast",
    "nickname:cannon",
    "nickname:hammer",
    "nickname:human-zoid",
    "nickname:wall",
  ]),
  nicknamePool("synchrony", [
    "nickname:chosen",
    "nickname:iron-born",
    "nickname:predator",
    "nickname:savage",
    "nickname:wild-one",
    "nickname:zoid-master",
  ]),
  nicknamePool("tactics", [
    "nickname:brain",
    "nickname:chess-player",
    "nickname:fox",
    "nickname:genius",
    "nickname:puppeteer",
    "nickname:shadow",
  ]),
  nicknamePool("technique", [
    "nickname:armor",
    "nickname:core",
    "nickname:forge",
    "nickname:machine",
    "nickname:master",
    "nickname:shield",
    "nickname:storm",
  ]),
] as const satisfies readonly NicknamePoolDefinition[];

export const nicknameIds = [
  ...new Set([
    ...defaultPool,
    ...nicknamePoolCatalog.flatMap(({ nicknames }) => nicknames),
  ]),
] as readonly NicknameId[];

const nicknameKeys = Object.fromEntries(
  nicknameIds.map((id) => [
    id,
    `nicknames:${id.slice("nickname:".length).replaceAll("-", "_")}`,
  ]),
) as Record<NicknameId, TranslationKey<"nicknames">>;

export function getNicknameKey(
  nicknameId: NicknameId,
): TranslationKey<"nicknames"> {
  const key = nicknameKeys[nicknameId];

  if (!key) {
    throw new RangeError(`Unknown nickname identifier: ${nicknameId}.`);
  }

  return key;
}

export function selectNickname(
  stats: Stats,
  random: RandomGenerator,
): NicknameId {
  const enabledNicknames = nicknamePoolCatalog.flatMap(
    ({ canBeGranted, nicknames }) => (canBeGranted(stats) ? nicknames : []),
  );
  const pool = enabledNicknames.length > 0 ? enabledNicknames : defaultPool;

  return random.weighted(pool.map((value) => ({ value, weight: 1 })));
}

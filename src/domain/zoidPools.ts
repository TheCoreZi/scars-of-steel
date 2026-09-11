import type { RandomGenerator } from "./random";
import type { Faction, Zoid, ZoidCategory, ZoidId, ZoidPoolId } from "./types";
import { getZoid } from "./zoids";

export interface ZoidPoolEntry {
  id: ZoidId;
  weight?: number;
}

export type ZoidPools = Readonly<
  Record<Faction, Readonly<Record<ZoidCategory, readonly ZoidPoolEntry[]>>>
>;

function createPool(ids: readonly ZoidId[]): readonly ZoidPoolEntry[] {
  return ids.map((id) => ({ id }));
}

export const zoidPools = {
  guylos: {
    rare: createPool([
      "zoid:black-rhymos",
      "zoid:hel-digunner",
      "zoid:helcat",
      "zoid:killer-dome",
      "zoid:redler",
      "zoid:rev-raptor",
      "zoid:twin-horn",
    ]),
    standard: createPool([
      "zoid:brachios",
      "zoid:geruder",
      "zoid:gun-tiger",
      "zoid:hammer-rock",
      "zoid:iguan",
      "zoid:molga",
      "zoid:sea-panther",
      "zoid:sinker",
      "zoid:storch",
    ]),
    "super-rare": createPool([
      "zoid:dimetrodon",
      "zoid:metal-rhymos",
      "zoid:red-horn",
      "zoid:redler-bc",
      "zoid:rev-raptor-pb",
      "zoid:saber-tiger",
      "zoid:wardick",
    ]),
    weak: createPool([
      "zoid:gator",
      "zoid:malder",
      "zoid:merda",
      "zoid:saicurtis",
      "zoid:zatton",
    ]),
  },
  helic: {
    rare: createPool([
      "zoid:arosaurer",
      "zoid:bear-fighter",
      "zoid:command-wolf",
      "zoid:gordos",
      "zoid:gorhecks",
      "zoid:mammoth",
      "zoid:stealth-viper",
    ]),
    standard: createPool([
      "zoid:barigator",
      "zoid:cannon-tortoise",
      "zoid:double-sworder",
      "zoid:godos",
      "zoid:guysack",
      "zoid:hidocker",
      "zoid:pteras",
      "zoid:spiker",
    ]),
    "super-rare": createPool([
      "zoid:bigasaurus",
      "zoid:command-wolf-ac",
      "zoid:dibison",
      "zoid:gun-sniper",
      "zoid:raynos",
      "zoid:shield-liger",
    ]),
    weak: createPool([
      "zoid:aquadon",
      "zoid:furolesios",
      "zoid:garius",
      "zoid:glidoler",
      "zoid:gorgodos",
      "zoid:gurantula",
      "zoid:pegasuros",
    ]),
  },
} as const satisfies ZoidPools;

export function zoidPoolHasEntries(
  category: ZoidCategory,
  faction: Faction,
): boolean {
  return (zoidPools[faction][category]?.length ?? 0) > 0;
}

export function selectZoidByCategory(
  category: ZoidCategory,
  faction: Faction,
  random: RandomGenerator,
): Zoid {
  return selectZoidFromPool(zoidPools[faction][category], random);
}

export function selectZoidFromPool(
  pool: readonly ZoidPoolEntry[],
  random: RandomGenerator,
): Zoid {
  const id = random.weighted(
    pool.map(({ id, weight = 1 }) => ({
      value: id,
      weight,
    })),
  );

  return getZoid(id);
}

export function validateZoidPools(pools: ZoidPools): void {
  const ids = new Set<ZoidId>();

  for (const [faction, categories] of Object.entries(pools)) {
    for (const pool of Object.values(categories)) {
      for (const { id, weight = 1 } of pool) {
        if (ids.has(id)) {
          throw new TypeError(`Duplicate Zoid pool entry: ${id}.`);
        }

        if (getZoid(id).faction !== faction) {
          throw new TypeError(`Zoid ${id} is in the wrong faction pool.`);
        }

        if (!Number.isFinite(weight) || weight <= 0) {
          throw new TypeError(`Zoid ${id} has an invalid pool weight.`);
        }

        ids.add(id);
      }
    }
  }
}

export const academyRewardPools = {
  "aerial-academy": {
    helic: [
      { id: "zoid:glidoler", weight: 100 },
      { id: "zoid:double-sworder", weight: 100 },
      { id: "zoid:pegasuros", weight: 10 },
      { id: "zoid:pteras", weight: 1 },
    ],
    guylos: [
      { id: "zoid:saicurtis", weight: 100 },
      { id: "zoid:sinker", weight: 100 },
      { id: "zoid:storch", weight: 10 },
      { id: "zoid:redler", weight: 1 },
    ],
  },
  herd: {
    helic: [
      { id: "zoid:elephantus", weight: 100 },
      { id: "zoid:cannon-tortoise", weight: 50 },
      { id: "zoid:mammoth", weight: 10 },
      { id: "zoid:dibison", weight: 1 },
    ],
    guylos: [
      { id: "zoid:geruder", weight: 20 },
      { id: "zoid:twin-horn", weight: 20 },
      { id: "zoid:black-rhymos", weight: 5 },
      { id: "zoid:metal-rhymos", weight: 1 },
    ],
  },
} as const satisfies Record<string, Record<Faction, readonly ZoidPoolEntry[]>>;

export const replacementPools = [
  { value: "weak", weight: 100 },
  { value: "rare", weight: 10 },
  { value: "super-rare", weight: 1 },
] as const;

export function isZoidRewardPoolAvailable(
  reward: ZoidPoolId,
  faction: Faction,
): boolean {
  if (reward === "academy-replacement")
    return replacementPools.every(({ value }) =>
      zoidPoolHasEntries(value, faction),
    );
  if (reward === "herd" || reward === "aerial-academy")
    return academyRewardPools[reward][faction].length > 0;
  return zoidPoolHasEntries(reward, faction);
}

export function selectRewardZoid(
  reward: ZoidPoolId,
  faction: Faction,
  random: RandomGenerator,
): Zoid {
  if (reward === "academy-replacement")
    return selectZoidByCategory(
      random.weighted(replacementPools),
      faction,
      random,
    );
  if (reward === "herd" || reward === "aerial-academy")
    return selectZoidFromPool(academyRewardPools[reward][faction], random);
  return selectZoidByCategory(reward, faction, random);
}

validateZoidPools(zoidPools);

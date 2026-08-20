import type { RandomGenerator } from "./random";
import type { Faction, Zoid, ZoidCategory, ZoidId } from "./types";
import { getZoid, zoids } from "./zoids";

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

export const initialZoidPools = {
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

export function hasInitialZoidPool(
  category: ZoidCategory,
  faction: Faction,
): boolean {
  return initialZoidPools[faction][category].length > 0;
}

export function selectInitialZoid(
  category: ZoidCategory,
  faction: Faction,
  random: RandomGenerator,
): Zoid {
  return selectZoidFromPool(initialZoidPools[faction][category], random);
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

  if (ids.size !== zoids.length) {
    throw new TypeError("Initial Zoid pools must include the full catalog.");
  }
}

validateZoidPools(initialZoidPools);

import type { Faction, ZoidCategory, ZoidId } from "./types";
import { getZoid, zoids } from "./zoids";

export type ZoidPools = Readonly<
  Record<Faction, Readonly<Record<ZoidCategory, readonly ZoidId[]>>>
>;

export const initialZoidPools = {
  guylos: {
    rare: [
      "zoid:black-rhymos",
      "zoid:hel-digunner",
      "zoid:helcat",
      "zoid:killer-dome",
      "zoid:redler",
      "zoid:rev-raptor",
      "zoid:twin-horn",
    ],
    standard: [
      "zoid:brachios",
      "zoid:geruder",
      "zoid:gun-tiger",
      "zoid:hammer-rock",
      "zoid:iguan",
      "zoid:molga",
      "zoid:sea-panther",
      "zoid:sinker",
      "zoid:storch",
    ],
    "super-rare": [
      "zoid:dimetrodon",
      "zoid:metal-rhymos",
      "zoid:red-horn",
      "zoid:redler-bc",
      "zoid:rev-raptor-pb",
      "zoid:saber-tiger",
      "zoid:wardick",
    ],
    weak: [
      "zoid:gator",
      "zoid:malder",
      "zoid:merda",
      "zoid:saicurtis",
      "zoid:zatton",
    ],
  },
  helic: {
    rare: [
      "zoid:arosaurer",
      "zoid:bear-fighter",
      "zoid:command-wolf",
      "zoid:gordos",
      "zoid:gorhecks",
      "zoid:mammoth",
      "zoid:stealth-viper",
    ],
    standard: [
      "zoid:barigator",
      "zoid:cannon-tortoise",
      "zoid:double-sworder",
      "zoid:godos",
      "zoid:guysack",
      "zoid:hidocker",
      "zoid:pteras",
      "zoid:spiker",
    ],
    "super-rare": [
      "zoid:bigasaurus",
      "zoid:command-wolf-ac",
      "zoid:dibison",
      "zoid:gun-sniper",
      "zoid:raynos",
      "zoid:shield-liger",
    ],
    weak: [
      "zoid:aquadon",
      "zoid:furolesios",
      "zoid:garius",
      "zoid:glidoler",
      "zoid:gorgodos",
      "zoid:gurantula",
      "zoid:pegasuros",
    ],
  },
} as const satisfies ZoidPools;

export function hasInitialZoidPool(
  category: ZoidCategory,
  faction: Faction,
): boolean {
  return initialZoidPools[faction][category].length > 0;
}

export function validateZoidPools(pools: ZoidPools): void {
  const ids = new Set<ZoidId>();

  for (const [faction, categories] of Object.entries(pools)) {
    for (const pool of Object.values(categories)) {
      for (const id of pool) {
        if (ids.has(id)) {
          throw new TypeError(`Duplicate Zoid pool entry: ${id}.`);
        }

        if (getZoid(id).faction !== faction) {
          throw new TypeError(`Zoid ${id} is in the wrong faction pool.`);
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

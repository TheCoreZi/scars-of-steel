import { academyZoidPools } from "./academyZoidPools";
import { initialZoidPools } from "./initialZoidPools";
import { militaryZoidPools } from "./militaryZoidPools";
import type { RandomGenerator } from "./random";
import type { Faction, Zoid, ZoidId, ZoidPoolId } from "./types";
import type { ZoidPoolCatalog } from "./zoidPoolDefinitions";
import { getZoid } from "./zoids";

export const zoidPools = {
  ...academyZoidPools,
  ...initialZoidPools,
  ...militaryZoidPools,
} as const satisfies ZoidPoolCatalog;

export function isZoidRewardPoolAvailable(
  poolId: ZoidPoolId,
  faction: Faction,
  excludedIds: readonly ZoidId[] = [],
): boolean {
  const pool = zoidPools[poolId] as ZoidPoolCatalog[ZoidPoolId] | undefined;
  return (pool?.[faction] ?? []).some(({ id }) => !excludedIds.includes(id));
}

export function selectRewardZoid(
  poolId: ZoidPoolId,
  faction: Faction,
  random: RandomGenerator,
  excludedIds: readonly ZoidId[] = [],
): Zoid | null {
  const entries = zoidPools[poolId][faction].filter(
    ({ id }) => !excludedIds.includes(id),
  );
  if (!entries.length) return null;
  return getZoid(
    random.weighted(
      entries.map((entry) => ({
        value: entry.id,
        weight: "weight" in entry ? (entry.weight ?? 1) : 1,
      })),
    ),
  );
}

export function validateZoidPools(pools: ZoidPoolCatalog): void {
  for (const [poolId, pool] of Object.entries(pools)) {
    for (const [faction, entries] of Object.entries(pool)) {
      const ids = new Set<ZoidId>();
      for (const { id, weight = 1 } of entries) {
        if (ids.has(id))
          throw new TypeError(`Duplicate Zoid ${id} in pool ${poolId}.`);
        if (getZoid(id).faction !== faction)
          throw new TypeError(`Zoid ${id} is in the wrong faction pool.`);
        if (!Number.isFinite(weight) || weight <= 0)
          throw new TypeError(`Zoid ${id} has an invalid pool weight.`);
        ids.add(id);
      }
    }
  }
}

validateZoidPools(zoidPools);

import type { Faction, ZoidId, ZoidPoolId } from "./types";

export interface ZoidPoolEntry {
  id: ZoidId;
  weight?: number;
}

export type ZoidPool = Readonly<Record<Faction, readonly ZoidPoolEntry[]>>;

export type ZoidPoolCatalog = Readonly<Record<ZoidPoolId, ZoidPool>>;

export function createZoidPool(
  guylos: readonly ZoidId[],
  helic: readonly ZoidId[],
): ZoidPool {
  return {
    guylos: guylos.map((id) => ({ id })),
    helic: helic.map((id) => ({ id })),
  };
}

export function withTotalWeight(
  entries: readonly ZoidPoolEntry[],
  totalWeight: number,
): readonly ZoidPoolEntry[] {
  return entries.map(({ id }) => ({
    id,
    weight: totalWeight / entries.length,
  }));
}

import { initialZoidPools } from "./initialZoidPools";
import { withTotalWeight, type ZoidPool } from "./zoidPoolDefinitions";
import type { Faction } from "./types";

const replacementWeights = [
  { poolId: "weak", weight: 100 },
  { poolId: "rare", weight: 10 },
  { poolId: "super-rare", weight: 1 },
] as const;

function createReplacementEntries(faction: Faction) {
  return replacementWeights.flatMap(({ poolId, weight }) =>
    withTotalWeight(initialZoidPools[poolId][faction], weight),
  );
}

export const academyZoidPools = {
  "academy-replacement": {
    guylos: createReplacementEntries("guylos"),
    helic: createReplacementEntries("helic"),
  },
  "aerial-academy": {
    guylos: [
      { id: "zoid:saicurtis", weight: 100 },
      { id: "zoid:sinker", weight: 100 },
      { id: "zoid:storch", weight: 10 },
      { id: "zoid:redler", weight: 1 },
    ],
    helic: [
      { id: "zoid:glidoler", weight: 100 },
      { id: "zoid:double-sworder", weight: 100 },
      { id: "zoid:pegasuros", weight: 10 },
      { id: "zoid:pteras", weight: 1 },
    ],
  },
  herd: {
    guylos: [
      { id: "zoid:geruder", weight: 20 },
      { id: "zoid:twin-horn", weight: 20 },
      { id: "zoid:black-rhymos", weight: 5 },
      { id: "zoid:metal-rhymos", weight: 1 },
    ],
    helic: [
      { id: "zoid:elephantus", weight: 100 },
      { id: "zoid:cannon-tortoise", weight: 50 },
      { id: "zoid:mammoth", weight: 10 },
      { id: "zoid:dibison", weight: 1 },
    ],
  },
} as const satisfies Record<string, ZoidPool>;

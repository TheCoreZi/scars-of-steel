import { getDeathChance } from "./battles";
import { applyOutcome } from "./outcomes";
import type { RandomGenerator } from "./random";
import type { AnnualRoll, Pilot } from "./types";
import { getEffectiveZoidPower } from "./zoids";

export function applyAnnualGrowth(
  pilot: Pilot,
  modifierPilot: Pilot,
  random: RandomGenerator,
) {
  const { charisma, piloting, strength, synchrony, tactics, technique } =
    pilot.stats;
  const index =
    piloting * 0.35 +
    synchrony * 0.25 +
    technique * 0.2 +
    tactics * 0.1 +
    strength * 0.05 +
    charisma * 0.05;
  const factor = 0.75 + index / 200;
  const amount =
    pilot.age > 40
      ? -Math.min(
          3,
          Math.max(1, Math.round(((pilot.age - 40) * 0.15) / factor)),
        )
      : Math.max(
          0,
          getAgeGrowth(pilot.age) + random.integer(0, 100) / 100 - 0.5,
        ) * factor;
  return applyOutcome(
    pilot,
    {
      effects: [{ amount, kind: "change-potential" }],
      id: "outcome:annual-growth",
      narrativeKey: "outcomes:annualGrowth",
    },
    random,
    modifierPilot,
  );
}

function getAgeGrowth(age: number): number {
  const anchors = [
    [12, 1.5],
    [15, 2],
    [20, 3],
    [25, 4],
    [30, 2],
    [37, 0.2],
    [40, 0],
  ] as const;
  for (let index = 1; index < anchors.length; index++) {
    const [endAge, endGrowth] = anchors[index];
    if (age > endAge) continue;
    const [startAge, startGrowth] = anchors[index - 1];
    const progress = Math.max(0, (age - startAge) / (endAge - startAge));
    return startGrowth + (endGrowth - startGrowth) * progress;
  }
  return 0;
}

export function resolveAnnualRecovery(
  pilot: Pilot,
  random: RandomGenerator,
  deathAlreadyChecked = false,
) {
  let updated = pilot;
  const rolls: AnnualRoll[] = [];
  function roll(
    kind: AnnualRoll["kind"],
    chance: number,
    zoidId?: AnnualRoll["zoidId"],
  ) {
    const value = random.probability() * 100;
    const success = value < chance;
    rolls.push({
      chance,
      kind,
      roll: value,
      success,
      ...(zoidId ? { zoidId } : {}),
    });
    return success;
  }
  if (updated.condition === "injured") {
    if (!deathAlreadyChecked && roll("death", getDeathChance(updated)))
      updated = { ...updated, condition: "dead" };
    else {
      let injuryCount = updated.injuryCount ?? 1;
      const injuries = injuryCount;
      for (let index = 0; index < injuries; index++) {
        if (roll("recovery", recoveryChance(updated.stats.strength)))
          injuryCount--;
      }
      updated = {
        ...updated,
        condition: injuryCount > 0 ? "injured" : "active",
        injuryCount,
      };
    }
  }
  if (updated.condition !== "dead" && updated.zoids) {
    const remainingDamage = updated.zoids.damagedIds.filter(
      (id) =>
        !roll(
          "repair",
          recoveryChance(
            updated.stats.synchrony * 0.5 +
              updated.stats.technique * 0.3 +
              getEffectiveZoidPower(updated, id) * 0.2,
          ),
          id,
        ),
    );
    updated = {
      ...updated,
      zoids: {
        ...updated.zoids,
        damagedIds: remainingDamage,
      },
    };
  }
  return { pilot: updated, rolls };
}

export function recoveryChance(value: number): number {
  const x = Math.min(100, Math.max(0, value)) / 100;
  return 20 + 60 * (0.5 * x + 1.5 * x * x - x * x * x);
}

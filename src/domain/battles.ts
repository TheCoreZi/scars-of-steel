import type { RandomGenerator } from "./random";
import { calculatePotential } from "./pilot";
import {
  type BattleRecord,
  type MilitaryRank,
  type Pilot,
  type SpecialRank,
  type WarState,
} from "./types";
import { getFactionControl, getOpposingFaction } from "./war";

interface BattleYear {
  firstFactionWins: number;
  pilot: Pilot;
  record: BattleRecord;
  secondFactionWins: number;
}

const militaryRankBattleFactors = {
  cadet: 0.02,
  captain: 0.7,
  commander: 0.96,
  corporal: 0.25,
  general: 1,
  lieutenant: 0.55,
  major: 0.9,
  sergeant: 0.4,
  soldier: 0.15,
} as const satisfies Record<MilitaryRank, number>;
const specialRankBattleFactors = {
  "blitz-orbit": 1.3,
  "eizen-dragoons": 1,
  "leo-master": 1.3,
  "machinery-four": 0.5,
  "prozen-knight": 1,
  "tactical-master": 1,
  traitor: 1,
} as const satisfies Record<SpecialRank, number>;

export function simulateBattleYear(
  pilot: Pilot,
  battles: number,
  warState: WarState,
  random: RandomGenerator,
): BattleYear {
  const assigned = getAssignedBattles(pilot, battles, random);
  const [firstSide, secondSide] = warState.sides;
  const opposingFaction = getOpposingFaction(warState, pilot.faction);
  let currentPilot = pilot;
  let firstFactionWins = 0;
  let injured = false;
  let killed = false;
  let losses = 0;
  let participated = 0;
  let secondFactionWins = 0;
  let wins = 0;
  let zoidDamaged = false;
  let zoidDestroyed = false;

  for (let battle = 0; battle < assigned; battle += 1) {
    if (currentPilot.condition !== "active" || !currentPilot.zoids) {
      break;
    }

    const result = simulatePilotBattle(currentPilot, warState, random);
    currentPilot = result.pilot;
    injured ||= result.injured;
    killed ||= result.killed;
    losses += result.won ? 0 : 1;
    participated += 1;
    wins += result.won ? 1 : 0;
    zoidDamaged ||= result.zoidDamaged;
    zoidDestroyed ||= result.zoidDestroyed;

    const winningFaction = result.won ? pilot.faction : opposingFaction;
    firstFactionWins += winningFaction === firstSide.faction ? 1 : 0;
    secondFactionWins += winningFaction === secondSide.faction ? 1 : 0;
  }

  for (let battle = participated; battle < battles; battle += 1) {
    if (random.chance(0.5)) {
      firstFactionWins += 1;
    } else {
      secondFactionWins += 1;
    }
  }

  return {
    firstFactionWins,
    pilot: currentPilot,
    record: {
      assigned,
      available: battles,
      injured,
      killed,
      losses,
      participated,
      wins,
      zoidDamaged,
      zoidDestroyed,
    },
    secondFactionWins,
  };
}

export function getAssignedBattles(
  pilot: Pilot,
  battles: number,
  random: RandomGenerator,
) {
  if (pilot.condition !== "active" || !pilot.zoids) {
    return 0;
  }

  const trustedBattles = Math.round(
    battles * (pilot.career.factionTrust / 100),
  );
  const rankFactor = pilot.career.specialRank
    ? specialRankBattleFactors[pilot.career.specialRank]
    : militaryRankBattleFactors[pilot.career.militaryRank];
  const assigned = Math.round(trustedBattles * rankFactor);

  return assigned === 0
    ? 0
    : Math.min(
        battles,
        Math.round(assigned * (0.9 + random.probability() * 0.1)),
      );
}

function simulatePilotBattle(
  pilot: Pilot & { zoids: NonNullable<Pilot["zoids"]> },
  warState: WarState,
  random: RandomGenerator,
) {
  const won =
    random.probability() * 100 <= getPerformance(pilot, warState, random);
  const injured = random.chance(getInjuryChance(pilot, won) / 100);
  const killed = injured && random.chance(getDeathChance(pilot) / 100);
  const zoidDamaged = random.chance(getZoidDamageChance(pilot, won) / 100);
  const zoidDestroyed =
    zoidDamaged && random.chance(getZoidDestructionChance(pilot) / 100);
  const damagedPilot = zoidDamaged
    ? updateZoidCondition(pilot, zoidDestroyed)
    : pilot;
  const updatedPilot = {
    ...damagedPilot,
    condition: killed ? "dead" : injured ? "injured" : "active",
  } as Pilot;

  return {
    injured,
    killed,
    pilot: { ...updatedPilot, potential: calculatePotential(updatedPilot) },
    won,
    zoidDamaged,
    zoidDestroyed,
  };
}

function getPerformance(
  pilot: Pilot & { zoids: NonNullable<Pilot["zoids"]> },
  warState: WarState,
  random: RandomGenerator,
) {
  return (
    pilot.potential * 0.4 +
    pilot.stats.tactics * 0.2 +
    pilot.stats.synchrony * 0.15 +
    getFactionControl(warState, pilot.faction) * 0.1 +
    pilot.stats.charisma * 0.05 +
    random.probability() * 100 * 0.1
  );
}

function getInjuryChance(pilot: Pilot, won: boolean) {
  const base = 2 + (won ? -0.5 : 2.5) + getInjuryAgeModifier(pilot.age);
  const protection = Math.max(
    0.25,
    1.5 -
      pilot.stats.strength * 0.01 -
      pilot.stats.technique * 0.003 -
      pilot.stats.tactics * 0.002,
  );

  return Math.min(15, Math.max(0.25, base * protection));
}

function getInjuryAgeModifier(age: number) {
  if (age < 21) return 0;
  if (age < 30) return 0.5;
  if (age < 40) return 1.5;
  if (age < 50) return 3;
  return Math.min(15, 5 + (age - 50) * 0.2);
}

function getDeathChance(pilot: Pilot) {
  return Math.min(
    15,
    Math.max(
      0.1,
      1 + getDeathAgeModifier(pilot.age) - pilot.stats.strength * 0.01,
    ),
  );
}

function getDeathAgeModifier(age: number) {
  if (age < 30) return 0;
  if (age < 40) return 0.5;
  if (age < 50) return 1.5;
  return 3 + (age - 50) * 0.15;
}

function getZoidDamageChance(pilot: Pilot, won: boolean) {
  const base = 2 + (won ? -0.5 : 2.5);
  const protection = Math.max(
    0.25,
    1.5 -
      pilot.stats.synchrony * 0.01 -
      pilot.stats.technique * 0.003 -
      pilot.stats.piloting * 0.002,
  );

  return Math.min(15, Math.max(0.25, base * protection));
}

function getZoidDestructionChance(pilot: Pilot) {
  return Math.min(15, Math.max(0.1, 1 - pilot.stats.synchrony * 0.01));
}

function updateZoidCondition(
  pilot: Pilot & { zoids: NonNullable<Pilot["zoids"]> },
  destroyed: boolean,
): Pilot {
  const { damagedIds, reserveIds, signatureId } = pilot.zoids;

  if (!destroyed) {
    return {
      ...pilot,
      zoids: {
        ...pilot.zoids,
        damagedIds: damagedIds.includes(signatureId)
          ? damagedIds
          : [...damagedIds, signatureId],
      },
    };
  }

  const [nextSignature, ...remainingReserve] = reserveIds;

  return {
    ...pilot,
    zoids: nextSignature
      ? {
          damagedIds: damagedIds.filter((id) => id !== signatureId),
          reserveIds: remainingReserve,
          signatureId: nextSignature,
        }
      : null,
  };
}

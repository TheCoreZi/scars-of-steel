import type { RandomGenerator } from "./random";
import {
  createBoundedValue,
  createWarState,
  type AppliedChange,
  type Faction,
  type WarIntensity,
  type WarState,
} from "./types";

interface WarIntensityRules {
  maximumMovement: number;
  minimumMovement: number;
}

export interface WarReport {
  loser: Faction;
  movement: number;
  urgency: "critical" | "major" | "minor" | "stale";
  winner: Faction;
}

export interface WarYear {
  battles: number;
  change: AppliedChange | null;
  warState: WarState;
}

const warIntensityRules = {
  active: { maximumMovement: 20, minimumMovement: 5 },
  fierce: { maximumMovement: 35, minimumMovement: 10 },
  low: { maximumMovement: 5, minimumMovement: 0 },
} as const satisfies Record<WarIntensity, WarIntensityRules>;

export function getFactionControl(warState: WarState, faction: Faction) {
  const side = warState.sides.find((entry) => entry.faction === faction);

  if (!side) {
    throw new RangeError(
      `Faction ${faction} does not participate in this war.`,
    );
  }

  return side.control;
}

export function getOpposingFaction(warState: WarState, faction: Faction) {
  const side = warState.sides.find((entry) => entry.faction !== faction);

  if (!side || !warState.sides.some((entry) => entry.faction === faction)) {
    throw new RangeError(
      `Faction ${faction} does not participate in this war.`,
    );
  }

  return side.faction;
}

export function getWarBattleCount(warState: WarState, random: RandomGenerator) {
  const dominant = Math.max(...warState.sides.map(({ control }) => control));
  const beforePeak = dominant <= 75;
  const progress = beforePeak ? (dominant - 50) / 25 : (dominant - 75) / 25;
  const minimum = Math.round(
    beforePeak ? 14 + 29 * progress : 43 * (1 - progress),
  );
  const maximum = Math.round(
    beforePeak ? 25 + 42 * progress : 67 * (1 - progress),
  );

  return random.integer(minimum, maximum);
}

export function advanceWarState(
  warState: WarState,
  firstFactionWins: number,
  secondFactionWins: number,
): WarYear {
  const battles = firstFactionWins + secondFactionWins;
  const margin = firstFactionWins - secondFactionWins;

  if (battles === 0 || margin === 0) {
    return { battles, change: null, warState };
  }

  const [firstSide, secondSide] = warState.sides;
  const rules = warIntensityRules[warState.intensity];
  const magnitude = Math.max(
    1,
    Math.round(
      rules.minimumMovement +
        (rules.maximumMovement - rules.minimumMovement) *
          (Math.abs(margin) / battles),
    ),
  );
  const movement = Math.sign(margin) * magnitude;
  const firstControl = createBoundedValue(
    Math.min(100, Math.max(0, firstSide.control + movement)),
  );
  const nextWarState = createWarState(
    firstSide.faction,
    firstControl,
    secondSide.faction,
    100 - firstControl,
    warState.intensity,
  );

  return {
    battles,
    change:
      firstControl === firstSide.control
        ? null
        : {
            current: firstControl,
            faction: firstSide.faction,
            previous: firstSide.control,
            target: "war-state",
          },
    warState: nextWarState,
  };
}

export function getWarReport(previous: WarState, current: WarState): WarReport {
  const [firstSide] = previous.sides;
  const movement =
    getFactionControl(current, firstSide.faction) - firstSide.control;
  const winner =
    movement >= 0
      ? firstSide.faction
      : getOpposingFaction(previous, firstSide.faction);
  const loser = getOpposingFaction(previous, winner);
  const magnitude = Math.abs(movement);

  return {
    loser,
    movement: magnitude,
    urgency:
      magnitude === 0
        ? "stale"
        : magnitude < 10
          ? "minor"
          : magnitude <= 30
            ? "major"
            : "critical",
    winner,
  };
}

export function updateWarControl(
  warState: WarState,
  faction: Faction,
  amount: number,
) {
  const current = getFactionControl(warState, faction);
  const updated = createBoundedValue(
    Math.min(100, Math.max(0, current + amount)),
  );
  const [firstSide, secondSide] = warState.sides;
  const firstControl =
    faction === firstSide.faction ? updated : createBoundedValue(100 - updated);

  return createWarState(
    firstSide.faction,
    firstControl,
    secondSide.faction,
    100 - firstControl,
    warState.intensity,
  );
}

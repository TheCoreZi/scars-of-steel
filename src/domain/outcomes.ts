import {
  createBoundedValue,
  type AchievementId,
  type AppliedChange,
  type Outcome,
  type Pilot,
  type StatChange,
  type ZoidId,
} from "./types";
import { calculatePotential } from "./pilot";
import { getFactionControl, updateWarControl } from "./war";

export function applyOutcome(
  pilot: Pilot,
  outcome: Outcome,
  zoidId?: ZoidId,
): { changes: readonly AppliedChange[]; pilotAfter: Pilot } {
  let updatedPilot = pilot;
  const changes: AppliedChange[] = [];

  for (const change of outcome.statChanges) {
    const applied = applyChange(updatedPilot, change);
    updatedPilot = applied.pilot;

    if (applied.change) {
      changes.push(applied.change);
    }
  }

  const pilotAfter = applyOutcomeCondition(
    zoidId ? addZoid(updatedPilot, zoidId) : updatedPilot,
    outcome,
  );

  return {
    changes,
    pilotAfter: { ...pilotAfter, potential: calculatePotential(pilotAfter) },
  };
}

function applyChange(
  pilot: Pilot,
  change: StatChange,
): { change: AppliedChange | null; pilot: Pilot } {
  if (change.target === "stat") {
    const previous = pilot.stats[change.stat];
    const current = changeBoundedValue(previous, change.amount);

    return {
      change:
        current === previous
          ? null
          : { current, previous, stat: change.stat, target: "stat" },
      pilot: { ...pilot, stats: { ...pilot.stats, [change.stat]: current } },
    };
  }

  if (change.target === "career-indicator") {
    const key = change.indicator === "faction-trust" ? "factionTrust" : "fame";
    const previous = pilot.career[key];
    const current = changeBoundedValue(previous, change.amount);

    return {
      change:
        current === previous
          ? null
          : {
              current,
              indicator: change.indicator,
              previous,
              target: "career-indicator",
            },
      pilot: { ...pilot, career: { ...pilot.career, [key]: current } },
    };
  }

  if (change.target === "war-state") {
    const previous = getFactionControl(pilot.career.warState, change.faction);
    const warState = updateWarControl(
      pilot.career.warState,
      change.faction,
      change.amount,
    );
    const current = getFactionControl(warState, change.faction);

    return {
      change:
        current === previous
          ? null
          : { current, faction: change.faction, previous, target: "war-state" },
      pilot: { ...pilot, career: { ...pilot.career, warState } },
    };
  }

  const basePotential = changeBoundedValue(pilot.basePotential, change.amount);
  const previous = pilot.potential;
  const updatedPilot = { ...pilot, basePotential };
  const current = calculatePotential(updatedPilot);

  return {
    change:
      current === previous ? null : { current, previous, target: "potential" },
    pilot: { ...updatedPilot, potential: current },
  };
}

function changeBoundedValue(value: number, amount: number) {
  return createBoundedValue(Math.min(100, Math.max(0, value + amount)));
}

function addZoid(pilot: Pilot, zoidId: ZoidId): Pilot {
  return {
    ...pilot,
    zoids: pilot.zoids
      ? {
          ...pilot.zoids,
          reserveIds: [...pilot.zoids.reserveIds, zoidId],
        }
      : { damagedIds: [], reserveIds: [], signatureId: zoidId },
  };
}

function applyOutcomeCondition(pilot: Pilot, outcome: Outcome): Pilot {
  return outcome.tags.includes("outcome-tag:injured")
    ? { ...pilot, condition: "injured" }
    : pilot;
}

export function getAchievementIds(outcome: Outcome): readonly AchievementId[] {
  const achievements: AchievementId[] = [];

  if (outcome.tags.includes("outcome-tag:humanitarian-aid")) {
    achievements.push("achievement:true-soldier");
  }

  if (outcome.tags.includes("outcome-tag:mechanics-program")) {
    achievements.push("achievement:born-in-workshop");
  }

  if (outcome.tags.includes("outcome-tag:reported-veteran")) {
    achievements.push("achievement:not-on-my-watch");
  }

  return achievements;
}

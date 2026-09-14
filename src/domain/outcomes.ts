import { calculatePotential } from "./pilot";
import type { RandomGenerator } from "./random";
import {
  createBoundedValue,
  type AchievementId,
  type AppliedChange,
  type BonusId,
  type CareerEndReason,
  type Outcome,
  type OutcomeEffect,
  type Pilot,
  type ZoidId,
} from "./types";
import { getFactionControl, updateWarControl } from "./war";
import { promotePilot } from "./ranks";
import { selectRewardZoid } from "./zoidPools";
import { getZoidPowerBeforeUpgrades } from "./zoids";

interface OutcomeContext {
  achievementIds: AchievementId[];
  bonusIds: BonusId[];
  changes: AppliedChange[];
  modifierPilot: Pilot;
  pilot: Pilot;
  random: RandomGenerator;
  stopped: boolean;
  zoidIds: ZoidId[];
}

interface OutcomeHandler<Effect extends OutcomeEffect> {
  apply(context: OutcomeContext, effect: Effect): OutcomeContext;
}

export interface AppliedOutcome {
  achievementIds: readonly AchievementId[];
  bonusIds: readonly BonusId[];
  changes: readonly AppliedChange[];
  pilotAfter: Pilot;
  zoidIds: readonly ZoidId[];
}

export function applyOutcome(
  pilot: Pilot,
  outcome: Outcome,
  random: RandomGenerator,
  modifierPilot: Pilot = pilot,
): AppliedOutcome {
  let context: OutcomeContext = {
    achievementIds: [],
    bonusIds: [],
    changes: [],
    modifierPilot,
    pilot,
    random,
    stopped: false,
    zoidIds: [],
  };

  for (const effect of outcome.effects) {
    context = applyEffect(context, effect);
    if (context.stopped) break;
  }

  return {
    achievementIds: context.achievementIds,
    bonusIds: context.bonusIds,
    changes: context.changes,
    pilotAfter: {
      ...context.pilot,
      potential: calculatePotential(context.pilot),
    },
    zoidIds: context.zoidIds,
  };
}

export function getOutcomeEndReason(outcome: Outcome): CareerEndReason | null {
  return (
    outcome.effects.find((effect) => effect.kind === "end-career")?.reason ??
    null
  );
}

export function hasOutcomeEffect(
  outcome: Outcome,
  kind: OutcomeEffect["kind"],
): boolean {
  return outcome.effects.some((effect) => effect.kind === kind);
}

export function getModifiedGain(
  amount: number,
  target: string,
  pilot: Pilot,
): number {
  if (
    amount <= 0 ||
    [
      "change-career-indicator",
      "change-war-control",
      "change-zoid-upgrades",
    ].includes(target)
  )
    return amount;
  const injury = pilot.condition === "injured" ? 0.5 : 1;
  const damage = pilot.zoids?.damagedIds.includes(pilot.zoids.signatureId)
    ? 0.75
    : 1;
  const bonus =
    pilot.bonusIds?.includes("organoid") &&
    ["piloting", "synchrony", "change-zoid-power"].includes(target)
      ? 1.5
      : 1;
  return Math.round(amount * injury * damage * bonus);
}

function applyEffect(
  context: OutcomeContext,
  effect: OutcomeEffect,
): OutcomeContext {
  switch (effect.kind) {
    case "change-military-rank":
      return changeMilitaryRankOutcome.apply(context, effect);
    case "change-career-indicator":
    case "change-potential":
    case "change-stat":
    case "change-war-control":
    case "change-zoid-power":
    case "change-zoid-upgrades":
      return changeValueOutcome.apply(context, effect);
    case "damage-signature-zoid":
      return damageSignatureZoidOutcome.apply(context, effect);
    case "end-career":
      return endCareerOutcome.apply(context, effect);
    case "grant-achievement":
      return grantAchievementOutcome.apply(context, effect);
    case "grant-bonus":
      return grantBonusOutcome.apply(context, effect);
    case "grant-career-flag":
      return grantCareerFlagOutcome.apply(context, effect);
    case "grant-zoid":
    case "replace-signature-zoid":
      return grantZoidOutcome.apply(context, effect);
    case "injure-pilot":
      return injurePilotOutcome.apply(context, effect);
    case "kill-pilot":
      return killPilotOutcome.apply(context, effect);
    case "remove-zoid":
      return removeZoidOutcome.apply(context, effect);
  }
}

class ChangeMilitaryRankOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "change-military-rank" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "change-military-rank" }>,
  ): OutcomeContext {
    void effect;
    return {
      ...context,
      pilot: promotePilot(context.pilot),
    };
  }
}

type ChangeValueEffect = Extract<
  OutcomeEffect,
  {
    kind:
      | "change-career-indicator"
      | "change-potential"
      | "change-stat"
      | "change-war-control"
      | "change-zoid-power"
      | "change-zoid-upgrades";
  }
>;

class ChangeValueOutcome implements OutcomeHandler<ChangeValueEffect> {
  apply(context: OutcomeContext, effect: ChangeValueEffect): OutcomeContext {
    const target = effect.kind === "change-stat" ? effect.stat : effect.kind;
    const amount = getModifiedGain(
      effect.amount,
      target,
      context.modifierPilot,
    );
    const applied = applyChange(context.pilot, effect, amount);
    return {
      ...context,
      changes: applied.change
        ? [...context.changes, applied.change]
        : context.changes,
      pilot: applied.pilot,
    };
  }
}

class DamageSignatureZoidOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "damage-signature-zoid" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "damage-signature-zoid" }>,
  ): OutcomeContext {
    void effect;
    if (!context.pilot.zoids) return context;
    return {
      ...context,
      pilot: {
        ...context.pilot,
        zoids: {
          ...context.pilot.zoids,
          damagedIds: [
            ...context.pilot.zoids.damagedIds,
            context.pilot.zoids.signatureId,
          ],
        },
      },
    };
  }
}

class EndCareerOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "end-career" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "end-career" }>,
  ): OutcomeContext {
    void effect;
    return { ...context, stopped: true };
  }
}

class GrantAchievementOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "grant-achievement" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "grant-achievement" }>,
  ): OutcomeContext {
    return {
      ...context,
      achievementIds: [
        ...new Set([...context.achievementIds, effect.achievementId]),
      ],
    };
  }
}

class GrantBonusOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "grant-bonus" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "grant-bonus" }>,
  ): OutcomeContext {
    const currentIds = context.pilot.bonusIds ?? [];
    return {
      ...context,
      bonusIds: currentIds.includes(effect.bonusId)
        ? context.bonusIds
        : [...context.bonusIds, effect.bonusId],
      pilot: {
        ...context.pilot,
        bonusIds: [...new Set([...currentIds, effect.bonusId])],
      },
    };
  }
}

class GrantCareerFlagOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "grant-career-flag" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "grant-career-flag" }>,
  ): OutcomeContext {
    const careerFlags = context.pilot.careerFlags;
    return careerFlags.includes(effect.careerFlag)
      ? context
      : {
          ...context,
          pilot: {
            ...context.pilot,
            careerFlags: [...careerFlags, effect.careerFlag],
          },
        };
  }
}

type GrantZoidEffect = Extract<
  OutcomeEffect,
  { kind: "grant-zoid" | "replace-signature-zoid" }
>;

class GrantZoidOutcome implements OutcomeHandler<GrantZoidEffect> {
  apply(context: OutcomeContext, effect: GrantZoidEffect): OutcomeContext {
    const zoid = selectRewardZoid(
      effect.poolId,
      context.pilot.faction,
      context.random,
    );
    return {
      ...context,
      pilot: addZoid(
        context.pilot,
        zoid.id,
        effect.kind === "replace-signature-zoid",
      ),
      zoidIds: [...context.zoidIds, zoid.id],
    };
  }
}

class InjurePilotOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "injure-pilot" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "injure-pilot" }>,
  ): OutcomeContext {
    void effect;
    if (context.pilot.condition === "dead") return context;
    return {
      ...context,
      pilot: {
        ...context.pilot,
        condition: "injured",
        injuryCount:
          (context.pilot.injuryCount ??
            (context.pilot.condition === "injured" ? 1 : 0)) + 1,
      },
    };
  }
}

class KillPilotOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "kill-pilot" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "kill-pilot" }>,
  ): OutcomeContext {
    void effect;
    return {
      ...context,
      pilot: { ...context.pilot, condition: "dead" },
      stopped: true,
    };
  }
}

class RemoveZoidOutcome implements OutcomeHandler<
  Extract<OutcomeEffect, { kind: "remove-zoid" }>
> {
  apply(
    context: OutcomeContext,
    effect: Extract<OutcomeEffect, { kind: "remove-zoid" }>,
  ): OutcomeContext {
    return { ...context, pilot: removeZoid(context.pilot, effect.zoidId) };
  }
}

const changeValueOutcome = new ChangeValueOutcome();
const changeMilitaryRankOutcome = new ChangeMilitaryRankOutcome();
const damageSignatureZoidOutcome = new DamageSignatureZoidOutcome();
const endCareerOutcome = new EndCareerOutcome();
const grantAchievementOutcome = new GrantAchievementOutcome();
const grantBonusOutcome = new GrantBonusOutcome();
const grantCareerFlagOutcome = new GrantCareerFlagOutcome();
const grantZoidOutcome = new GrantZoidOutcome();
const injurePilotOutcome = new InjurePilotOutcome();
const killPilotOutcome = new KillPilotOutcome();
const removeZoidOutcome = new RemoveZoidOutcome();

function applyChange(
  pilot: Pilot,
  effect: ChangeValueEffect,
  amount: number,
): { change: AppliedChange | null; pilot: Pilot } {
  if (effect.kind === "change-stat") {
    const previous = pilot.stats[effect.stat];
    const current = changeBoundedValue(previous, amount);
    return {
      change:
        current === previous
          ? null
          : { current, previous, stat: effect.stat, target: "stat" },
      pilot: { ...pilot, stats: { ...pilot.stats, [effect.stat]: current } },
    };
  }

  if (effect.kind === "change-career-indicator") {
    const key = effect.indicator === "faction-trust" ? "factionTrust" : "fame";
    const previous = pilot.career[key];
    const current = changeBoundedValue(previous, amount);
    return {
      change:
        current === previous
          ? null
          : {
              current,
              indicator: effect.indicator,
              previous,
              target: "career-indicator",
            },
      pilot: { ...pilot, career: { ...pilot.career, [key]: current } },
    };
  }

  if (effect.kind === "change-war-control") {
    const previous = getFactionControl(pilot.career.warState, effect.faction);
    const warState = updateWarControl(
      pilot.career.warState,
      effect.faction,
      amount,
    );
    const current = getFactionControl(warState, effect.faction);
    return {
      change:
        current === previous
          ? null
          : { current, faction: effect.faction, previous, target: "war-state" },
      pilot: { ...pilot, career: { ...pilot.career, warState } },
    };
  }

  if (
    effect.kind === "change-zoid-power" ||
    effect.kind === "change-zoid-upgrades"
  ) {
    if (!pilot.zoids) return { change: null, pilot };
    const zoidId = pilot.zoids.signatureId;
    const progress = pilot.zoidProgress?.[zoidId] ?? {
      power: createBoundedValue(getZoidPowerBeforeUpgrades(pilot, zoidId)),
      upgrades: 0,
    };
    const key = effect.kind === "change-zoid-power" ? "power" : "upgrades";
    const previous = progress[key];
    const current =
      key === "power"
        ? changeBoundedValue(previous, amount)
        : Math.max(0, Math.round(previous + amount));
    return {
      change:
        current === previous
          ? null
          : {
              current,
              previous,
              target: key === "power" ? "zoid-power" : "zoid-upgrades",
              zoidId,
            },
      pilot: {
        ...pilot,
        zoidProgress: {
          ...pilot.zoidProgress,
          [zoidId]: { ...progress, [key]: current },
        },
      },
    };
  }

  const basePotential = changeBoundedValue(pilot.basePotential, amount);
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

function addZoid(pilot: Pilot, zoidId: ZoidId, replace = false): Pilot {
  const oldId = pilot.zoids?.signatureId;
  const progress = { ...pilot.zoidProgress };
  if (replace && oldId) delete progress[oldId];
  if (!progress[zoidId])
    progress[zoidId] = {
      power: createBoundedValue(
        getZoidPowerBeforeUpgrades(
          { ...pilot, zoidProgress: progress },
          zoidId,
        ),
      ),
      upgrades: 0,
    };
  return {
    ...pilot,
    zoidProgress: progress,
    zoids:
      pilot.zoids && replace
        ? {
            damagedIds: pilot.zoids.damagedIds.filter(
              (id) => id !== oldId && id !== zoidId,
            ),
            reserveIds: pilot.zoids.reserveIds.filter(
              (id) => id !== zoidId && id !== oldId,
            ),
            signatureId: zoidId,
          }
        : pilot.zoids
          ? {
              ...pilot.zoids,
              reserveIds:
                zoidId === pilot.zoids.signatureId
                  ? pilot.zoids.reserveIds
                  : [...new Set([...pilot.zoids.reserveIds, zoidId])],
            }
          : { damagedIds: [], reserveIds: [], signatureId: zoidId },
  };
}

function removeZoid(pilot: Pilot, zoidId: ZoidId): Pilot {
  if (!pilot.zoids) return pilot;
  const progress = { ...pilot.zoidProgress };
  delete progress[zoidId];
  if (pilot.zoids.signatureId !== zoidId)
    return {
      ...pilot,
      zoidProgress: progress,
      zoids: {
        ...pilot.zoids,
        damagedIds: pilot.zoids.damagedIds.filter((id) => id !== zoidId),
        reserveIds: pilot.zoids.reserveIds.filter((id) => id !== zoidId),
      },
    };
  const [signatureId, ...reserveIds] = pilot.zoids.reserveIds;
  return signatureId
    ? {
        ...pilot,
        zoidProgress: progress,
        zoids: {
          damagedIds: pilot.zoids.damagedIds.filter((id) => id !== zoidId),
          reserveIds,
          signatureId,
        },
      }
    : { ...pilot, zoidProgress: progress, zoids: null };
}

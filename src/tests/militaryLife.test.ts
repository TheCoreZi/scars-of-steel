import { existsSync, readFileSync } from "node:fs";
import { afterEach, describe, expect, test } from "vitest";

import { parseCsv } from "../app/eventReviewCsv";
import {
  createEmptyGameData,
  loadGameData,
  saveGameData,
} from "../app/gameStorage";
import {
  advanceCareerYear,
  createCareerHistory,
  getCareerEndReason,
} from "../domain/career";
import { getEligibleEventIds } from "../domain/eventPools";
import { getEvent, getOutcome } from "../domain/events";
import { militaryLifeEvents } from "../domain/militaryLifeEvents";
import { militaryLifeOutcomeCatalog } from "../domain/militaryLifeOutcomes";
import {
  applyOutcome,
  getResolvedOutcomeNarrativeKey,
} from "../domain/outcomes";
import { createInitialPilot } from "../domain/pilot";
import {
  createSeededRandomGenerator,
  type RandomGenerator,
} from "../domain/random";
import {
  createBoundedValue,
  type Faction,
  type Outcome,
  type OutcomeEffect,
  type Pilot,
  type ZoidId,
} from "../domain/types";
import { resolveYear } from "../domain/year";
import { zoidPools } from "../domain/zoidPools";
import { getZoid } from "../domain/zoids";
import { i18n } from "../i18n";

const document = parseCsv(
  readFileSync("src/tests/fixtures/military-life.csv", "utf8"),
);
const rows = document.rows.map((row) =>
  Object.fromEntries(document.headers.map((key, i) => [key, row[i]])),
);
const initial = createInitialPilot({
  aspiration: "zoid-ace",
  faction: "helic",
  id: "pilot:military-test",
  name: "Military Pilot",
});
const pilot: Pilot = {
  ...initial,
  age: 21,
  basePotential: createBoundedValue(30),
  career: {
    ...initial.career,
    factionTrust: createBoundedValue(30),
    militaryRank: "private",
  },
  stats: Object.fromEntries(
    Object.keys(initial.stats).map((key) => [key, createBoundedValue(30)]),
  ) as unknown as Pilot["stats"],
  zoids: { damagedIds: [], reserveIds: [], signatureId: "zoid:godos" },
};
const budgets: Record<string, readonly [number, number]> = {
  "10": [18, -2],
  "25": [17, -3],
  "35": [9, -3],
  "40": [7, -4],
  "45": [7, -4],
  "55": [6, -5],
  "60": [5, -6],
  "70": [4, -7],
  "": [3, 0],
};
const physicalCost: Record<string, number> = {
  "injure-pilot": -4,
  "damage-signature-zoid": -4,
  "destroy-signature-zoid": -6,
};

afterEach(() => window.localStorage.clear());

describe("military life content", () => {
  test("distributes stat gains, losses, and probability weights across the batch", () => {
    const stats = Object.keys(pilot.stats);
    const totals = stats.map((stat) => {
      const effects = Object.values(militaryLifeOutcomeCatalog)
        .flatMap((o) => o.effects)
        .filter((e) => e.kind === "change-stat" && e.stat === stat);
      return {
        gains: effects.reduce(
          (sum, e) =>
            sum + (e.kind === "change-stat" ? Math.max(0, e.amount) : 0),
          0,
        ),
        losses: effects.reduce(
          (sum, e) =>
            sum + (e.kind === "change-stat" ? Math.max(0, -e.amount) : 0),
          0,
        ),
        weight: militaryLifeEvents
          .flatMap((e) => e.decisions)
          .flatMap((d) => (d.kind === "chance" ? d.probabilityStats : []))
          .filter((p) => p.stat === stat)
          .reduce((sum, p) => sum + p.weight, 0),
      };
    });
    for (const [key, limit] of [
      ["gains", 1.25],
      ["losses", 1.6],
      ["weight", 1.2],
    ] as const) {
      const values = totals.map((t) => t[key]);
      expect(Math.min(...values)).toBeGreaterThan(0);
      expect(Math.max(...values) / Math.min(...values)).toBeLessThanOrEqual(
        limit,
      );
    }
  });
  // The docs directory is local. The fixture keeps approved gameplay data available in CI.
  test.runIf(existsSync("docs/military-life-events-years-21-25.csv"))(
    "keeps the gameplay fixture synchronized with the local review CSV",
    () => {
      const review = parseCsv(
        readFileSync("docs/military-life-events-years-21-25.csv", "utf8"),
      );
      expect(
        review.rows.map((row) =>
          document.headers.map((key) => row[review.headers.indexOf(key)]),
        ),
      ).toEqual(document.rows);
    },
  );
  test("matches all approved CSV texts, probabilities, effects, and conditions", () => {
    expect(militaryLifeEvents).toHaveLength(10);
    expect(rows).toHaveLength(30);
    expect(Object.keys(militaryLifeOutcomeCatalog)).toHaveLength(50);
    for (const row of rows) {
      const event = getEvent(`event:${row.event_id}`);
      const decision = event.decisions[Number(row.choice_number) - 1];
      const t = (key: string) => i18n.getFixedT("es")(key as never);
      expect(t(event.titleKey)).toBe(row.title || t(event.titleKey));
      if (row.introduction)
        expect(t(event.introductionKey)).toBe(row.introduction);
      expect(t(decision.labelKey)).toBe(row.choice_label);
      expect(t(decision.descriptionKey)).toBe(row.choice_description);
      expect(decision.kind).toBe(row.kind);
      expect(event.ages).toEqual([21, 22, 23, 24, 25]);
      expect(event.factions).toEqual(["guylos", "helic"]);
      expect(event.requiresZoid).toBe(true);
      if (decision.kind === "chance") {
        expect(decision.baseSuccessChance).toBe(
          Number(row.base_success_chance),
        );
        expect(decision.probabilityStats).toEqual(
          row.probability_stats.split(";").map((pair) => {
            const [stat, weight] = pair.split(":");
            return { stat, weight: Number(weight) };
          }),
        );
      }
      for (const result of ["success", "failure"] as const) {
        if (!row[`${result}_outcome`]) continue;
        const outcome = getOutcome(
          `outcome:${row.event_id}-${row.choice_number}-${result}`,
        );
        expect(t(outcome.narrativeKey)).toBe(row[`${result}_outcome`]);
        expect(
          outcome.effects
            .filter((e) => "amount" in e || e.kind === "change-military-rank")
            .map(effectToCsv),
        ).toEqual(row[`${result}_effects`].split(";"));
        const condition = row[`${result}_condition`];
        expect(outcome.effects.some((e) => e.kind === "injure-pilot")).toBe(
          condition.includes("injured"),
        );
        expect(
          outcome.effects.some((e) => e.kind === "damage-signature-zoid"),
        ).toBe(condition.includes("zoid-damaged"));
        expect(
          outcome.effects.some((e) => e.kind === "destroy-signature-zoid"),
        ).toBe(condition.includes("zoid-destroyed"));
        const stats = outcome.effects.filter((e) => e.kind === "change-stat");
        expect(stats.some((e) => e.amount > 0)).toBe(true);
        if (result === "success")
          expect(stats.some((e) => e.amount < 0)).toBe(true);
        expect(score(outcome)).toBe(
          budgets[row.base_success_chance][result === "success" ? 0 : 1],
        );
        for (const effect of outcome.effects)
          if (
            effect.kind === "change-career-indicator" &&
            effect.indicator === "faction-trust"
          )
            expect(effect.amount).toBeGreaterThanOrEqual(-2);
        for (const lng of ["es", "en"]) {
          for (const key of [
            event.titleKey,
            event.introductionKey,
            decision.labelKey,
            decision.descriptionKey,
            outcome.narrativeKey,
            ...Object.values(outcome.narrativeVariants ?? {}),
          ])
            expect(i18n.exists(key, { lng })).toBe(true);
        }
      }
    }
  });

  test("keeps unavailable rewards and promotions inside the story", () => {
    const keys = Object.values(militaryLifeOutcomeCatalog).flatMap((outcome) =>
      Object.entries(outcome.narrativeVariants ?? {})
        .filter(([variant]) =>
          ["rank-unchanged", "reward-unavailable"].includes(variant),
        )
        .map(([, key]) => key),
    );

    for (const lng of ["en", "es"] as const)
      for (const key of keys)
        expect(String(i18n.t(key as never, { lng } as never))).not.toMatch(
          /available models|highest rank|modelos disponibles|rango más alto/i,
        );
  });

  test.each(["helic", "guylos"] as const)(
    "keeps eligible events available at every military age for %s",
    (faction) => {
      const subject = forFaction(faction);
      for (const age of [21, 22, 23, 24, 25]) {
        const completed = militaryLifeEvents
          .slice(0, age - 21)
          .map((e) => e.id);
        expect(
          getEligibleEventIds({ ...subject, age }, completed),
        ).toHaveLength(10 - completed.length);
        expect(
          getEligibleEventIds({ ...subject, age, zoids: null }, []),
        ).toEqual([]);
      }
      expect(getEligibleEventIds({ ...subject, age: 20 }, [])).not.toContain(
        militaryLifeEvents[0].id,
      );
      expect(getEligibleEventIds({ ...subject, age: 26 }, [])).toEqual([]);
      expect(
        getEligibleEventIds(advanceCareerYear({ ...subject, age: 20 }), []),
      ).toHaveLength(10);
      expect(
        getCareerEndReason(
          { ...subject, zoids: null },
          [],
          militaryLifeOutcomeCatalog[
            "outcome:military-life-empty-bunks-3-success"
          ],
        ),
      ).toBe("no-eligible-events");
    },
  );

  test.each(["helic", "guylos"] as const)(
    "matches reward membership, weights, and faction for %s",
    (faction) => {
      for (const row of rows.filter((r) =>
        r.success_zoid_reward.startsWith("helic:"),
      )) {
        const outcome = getOutcome(
          `outcome:${row.event_id}-${row.choice_number}-success`,
        );
        const effect = outcome.effects.find((e) => e.kind === "grant-zoid")!;
        const pool = zoidPools[effect.poolId][faction];
        const expected = row.success_zoid_reward
          .split(";")
          .find((s) => s.startsWith(faction + ":"))!
          .slice(faction.length + 1)
          .split("|");
        expect(pool.map((e) => e.id)).toEqual(expected);
        for (const entry of pool)
          expect(getZoid(entry.id).faction).toBe(faction);
      }
      const weights = zoidPools["military-prototypes"][faction].map(
        ({ weight = 1 }) => weight,
      );
      expect(weights.every((weight) => weight > 0)).toBe(true);
      const replacement = zoidPools["academy-replacement"][faction];
      for (const [poolId, totalWeight] of [
        ["weak", 100],
        ["rare", 10],
        ["super-rare", 1],
      ] as const) {
        const ids = new Set(zoidPools[poolId][faction].map(({ id }) => id));
        expect(
          replacement
            .filter(({ id }) => ids.has(id))
            .reduce((sum, { weight = 1 }) => sum + weight, 0),
        ).toBeCloseTo(totalWeight);
      }
    },
  );
});

describe("military rewards and losses", () => {
  test.each(["helic", "guylos"] as const)(
    "adds unowned rewards to reserve and handles exhausted pools for %s",
    (faction) => {
      const subject = forFaction(faction);
      for (const outcome of Object.values(militaryLifeOutcomeCatalog).filter(
        (o) => o.effects.some((e) => e.kind === "grant-zoid"),
      )) {
        const first = applyOutcome(subject, outcome, predictable());
        const second = applyOutcome(first.pilotAfter, outcome, predictable());
        expect(first.pilotAfter.zoids?.signatureId).toBe(
          subject.zoids?.signatureId,
        );
        expect(first.pilotAfter.zoids?.reserveIds).toContain(first.zoidIds[0]);
        expect(second.zoidIds[0]).not.toBe(first.zoidIds[0]);
        const effect = outcome.effects.find((e) => e.kind === "grant-zoid")!;
        const exhausted: Pilot = {
          ...subject,
          zoids: {
            ...subject.zoids!,
            reserveIds: zoidPools[effect.poolId][faction].map((e) => e.id),
          },
        };
        const result = applyOutcome(exhausted, outcome, predictable());
        expect(result.zoidIds).toEqual([]);
        expect(result.pilotAfter.zoids).toEqual(exhausted.zoids);
        expect(
          getResolvedOutcomeNarrativeKey({
            outcome,
            pilotBefore: exhausted,
            zoidIds: result.zoidIds,
          }),
        ).toBe(outcome.narrativeVariants?.["reward-unavailable"]);
      }
    },
  );

  test.each(["helic", "guylos"] as const)(
    "destroys only the signature and replaces only an empty collection for %s",
    (faction) => {
      const subject = forFaction(faction);
      const originalId = subject.zoids!.signatureId;
      const reserves = zoidPools.rare[faction].slice(0, 2).map((e) => e.id);
      for (const outcome of Object.values(militaryLifeOutcomeCatalog).filter(
        (o) => o.effects.some((e) => e.kind === "destroy-signature-zoid"),
      )) {
        const withoutReserve = applyOutcome(subject, outcome, predictable());
        expect(withoutReserve.zoidIds).toHaveLength(1);
        expect(withoutReserve.pilotAfter.condition).not.toBe("dead");
        expect(getZoid(withoutReserve.zoidIds[0]).faction).toBe(faction);
        for (const damagedIds of [
          [originalId, reserves[0]],
          [originalId, ...reserves],
        ]) {
          const before: Pilot = {
            ...subject,
            zoidProgress: {
              [originalId]: { power: createBoundedValue(80), upgrades: 3 },
            },
            zoids: {
              signatureId: originalId,
              reserveIds: reserves,
              damagedIds,
            },
          };
          const result = applyOutcome(before, outcome, predictable());
          expect(result.zoidIds).toEqual([]);
          expect(result.pilotAfter.zoids?.signatureId).toBe(
            damagedIds.length === 2 ? reserves[1] : reserves[0],
          );
          expect(result.pilotAfter.zoidProgress?.[originalId]).toBeUndefined();
          expect(result.pilotAfter.zoids?.damagedIds).toEqual(
            damagedIds.filter((id) => id !== originalId),
          );
          expect(
            [
              result.pilotAfter.zoids!.signatureId,
              ...result.pilotAfter.zoids!.reserveIds,
            ].sort(),
          ).toEqual([...reserves].sort());
        }
      }
    },
  );

  test("replaces the body before upgrading, preserves reserves, and resets a same-model body", () => {
    const outcome = getOutcome("outcome:military-life-trapped-core-2-success");
    for (const sameModel of [true, false]) {
      const originalId: ZoidId = sameModel ? "zoid:aquadon" : "zoid:godos";
      const before: Pilot = {
        ...pilot,
        zoids: {
          signatureId: originalId,
          reserveIds: ["zoid:command-wolf"],
          damagedIds: [originalId, "zoid:command-wolf"],
        },
        zoidProgress: {
          [originalId]: { power: createBoundedValue(90), upgrades: 4 },
          "zoid:command-wolf": { power: createBoundedValue(50), upgrades: 2 },
        },
      };
      const result = applyOutcome(before, outcome, predictable());
      expect(result.pilotAfter.zoids).toEqual({
        signatureId: "zoid:aquadon",
        reserveIds: ["zoid:command-wolf"],
        damagedIds: ["zoid:command-wolf"],
      });
      expect(result.pilotAfter.zoidProgress?.["zoid:aquadon"]).toEqual({
        power: getZoid("zoid:aquadon").basePower,
        upgrades: 1,
      });
      expect(result.pilotAfter.zoidProgress?.["zoid:command-wolf"]).toEqual(
        before.zoidProgress?.["zoid:command-wolf"],
      );
      expect(
        getResolvedOutcomeNarrativeKey({
          outcome,
          pilotBefore: before,
          zoidIds: result.zoidIds,
        }),
      ).toBe(
        sameModel
          ? outcome.narrativeVariants?.["same-model"]
          : outcome.narrativeKey,
      );
    }
  });

  test("uses a new body of the current model when all replacement models are reserves", () => {
    const outcome = getOutcome("outcome:military-life-trapped-core-2-success");
    const reserves = [
      ...zoidPools.weak.helic,
      ...zoidPools.rare.helic,
      ...zoidPools["super-rare"].helic,
    ].map((e) => e.id);
    const before: Pilot = {
      ...pilot,
      zoids: { ...pilot.zoids!, reserveIds: reserves },
    };
    const result = applyOutcome(before, outcome, predictable());
    expect(result.pilotAfter.zoids?.reserveIds).toEqual(reserves);
    expect(result.pilotAfter.zoids?.signatureId).toBe("zoid:godos");
    expect(result.pilotAfter.zoidProgress?.["zoid:godos"]?.upgrades).toBe(1);
  });

  test("does not announce a promotion at maximum rank", () => {
    const outcome = getOutcome(
      "outcome:military-life-abandoned-hangar-2-success",
    );
    const before: Pilot = {
      ...pilot,
      career: { ...pilot.career, militaryRank: "general" },
    };
    const result = applyOutcome(before, outcome, predictable());
    expect(result.pilotAfter.career.factionTrust).toBe(
      before.career.factionTrust,
    );
    expect(
      getResolvedOutcomeNarrativeKey({
        outcome,
        pilotBefore: before,
        zoidIds: [],
      }),
    ).toBe(outcome.narrativeVariants?.["rank-unchanged"]);
  });

  test("does not injure the player or damage the flagship when only other pilots or test Zoids suffer", () => {
    for (const id of [
      "field-trials-1-failure",
      "field-trials-2-failure",
      "squadron-friction-2-failure",
      "squadron-friction-3-success",
    ]) {
      const result = applyOutcome(
        pilot,
        getOutcome(`outcome:military-life-${id}`),
        predictable(),
      );
      expect(result.pilotAfter.condition).toBe("active");
      expect(result.pilotAfter.zoids).toEqual(pilot.zoids);
    }
  });
});

describe("military persistence", () => {
  test.each(["helic", "guylos"] as const)(
    "resolves and reloads every outcome for %s",
    (faction) => {
      for (const event of militaryLifeEvents)
        for (const decision of event.decisions)
          for (const fail of decision.kind === "chance"
            ? [false, true]
            : [false]) {
            const random = predictable();
            let first = true;
            random.probability = () => {
              const roll = first && fail ? 0.99 : 0;
              first = false;
              return roll;
            };
            const result = resolveYear(
              decision,
              event,
              forFaction(faction),
              random,
            );
            const activeGame = {
              eventId: event.id,
              history: createCareerHistory(),
              phase: "outcome",
              pilot: result.pilotAfter,
              result,
              screen: "event",
            } as const;
            const data = { ...createEmptyGameData(), activeGame };
            saveGameData(data);
            expect(loadGameData()).toEqual(data);
          }
    },
  );

  test("rejects a forged narrative variant", () => {
    const event = militaryLifeEvents[0];
    const result = resolveYear(event.decisions[0], event, pilot, predictable());
    const data = {
      ...createEmptyGameData(),
      activeGame: {
        eventId: event.id,
        history: createCareerHistory(),
        phase: "outcome",
        pilot: result.pilotAfter,
        result,
        screen: "event",
      },
    };
    result.outcome = {
      ...result.outcome,
      narrativeVariants: { "reward-unavailable": "outcomes:forged" },
    };
    window.localStorage.setItem(
      "scars-of-steel:game-data",
      JSON.stringify(data),
    );
    expect(loadGameData().activeGame).toBeNull();
  });
});

function effectToCsv(effect: OutcomeEffect): string {
  if (effect.kind === "change-military-rank") return "military-rank:+1";
  if (!("amount" in effect)) throw new Error("Expected a numeric effect.");
  const name =
    effect.kind === "change-stat"
      ? effect.stat
      : effect.kind === "change-career-indicator"
        ? effect.indicator
        : effect.kind.replace("change-", "");
  return `${name}:${effect.amount > 0 ? "+" : ""}${effect.amount}`;
}

function score(outcome: Outcome): number {
  const destroyed = outcome.effects.some(
    (e) => e.kind === "destroy-signature-zoid",
  );
  return outcome.effects.reduce((total, effect) => {
    if (effect.kind === "change-military-rank") return total + 16;
    if (effect.kind === "change-stat") return total + effect.amount;
    if (
      effect.kind === "change-career-indicator" ||
      effect.kind === "change-potential"
    )
      return total + effect.amount * 2;
    if (effect.kind === "change-zoid-upgrades")
      return total + effect.amount * 4;
    return (
      total +
      (destroyed && effect.kind === "damage-signature-zoid"
        ? 0
        : (physicalCost[effect.kind] ?? 0))
    );
  }, 0);
}

function forFaction(faction: Faction): Pilot {
  return {
    ...pilot,
    faction,
    zoids: {
      damagedIds: [],
      reserveIds: [],
      signatureId: faction === "helic" ? "zoid:godos" : "zoid:molga",
    },
  };
}

function predictable(): RandomGenerator {
  return {
    ...createSeededRandomGenerator(1),
    chance: () => false,
    integer: (min) => min,
    probability: () => 0,
    weighted: (entries) => entries[0].value,
  };
}

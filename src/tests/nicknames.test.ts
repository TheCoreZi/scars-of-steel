import { describe, expect, test, vi } from "vitest";

import { getNicknameKey, selectNickname } from "../domain/nicknames";
import type { RandomGenerator } from "../domain/random";
import { createBoundedValue, type Stats } from "../domain/types";

function createRandom(): RandomGenerator {
  return {
    chance: vi.fn(),
    integer: vi.fn(),
    probability: vi.fn(),
    weighted: vi.fn((entries) => entries[entries.length - 1].value),
  };
}

function createStats(
  changes: Partial<Record<keyof Stats, number>> = {},
): Stats {
  const value = (stat: keyof Stats) => createBoundedValue(changes[stat] ?? 0);

  return {
    charisma: value("charisma"),
    piloting: value("piloting"),
    strength: value("strength"),
    synchrony: value("synchrony"),
    tactics: value("tactics"),
    technique: value("technique"),
  };
}

describe("nickname selection", () => {
  test("uses only the default pool below the stat threshold", () => {
    const random = createRandom();

    selectNickname(createStats(), random);

    const entries = vi.mocked(random.weighted).mock.calls[0][0];
    expect(entries).toHaveLength(18);
    expect(entries).toContainEqual({ value: "nickname:guardian", weight: 1 });
  });

  test("combines all enabled stat nicknames with equal item weights", () => {
    const random = createRandom();

    selectNickname(createStats({ piloting: 80, synchrony: 90 }), random);

    const entries = vi.mocked(random.weighted).mock.calls[0][0];
    expect(entries).toHaveLength(11);
    expect(entries.every(({ weight }) => weight === 1)).toBe(true);
    expect(entries).toContainEqual({ value: "nickname:ace", weight: 1 });
    expect(entries).toContainEqual({ value: "nickname:chosen", weight: 1 });
    expect(entries).not.toContainEqual({
      value: "nickname:guardian",
      weight: 1,
    });
  });

  test("accepts shadow in the tactics and default pools", () => {
    const random = createRandom();

    selectNickname(createStats({ tactics: 80 }), random);

    const entries = vi.mocked(random.weighted).mock.calls[0][0];
    expect(entries).toContainEqual({ value: "nickname:shadow", weight: 1 });
    expect(getNicknameKey("nickname:shadow")).toBe("nicknames:shadow");
  });
});

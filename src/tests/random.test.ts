import { describe, expect, expectTypeOf, test } from "vitest";

import {
  createSecureRandomGenerator,
  createSeededRandomGenerator,
  type RandomGenerator,
} from "../domain/random";

describe("createSecureRandomGenerator", () => {
  test("creates a replaceable random generator", () => {
    expectTypeOf(
      createSecureRandomGenerator(),
    ).toMatchTypeOf<RandomGenerator>();
  });

  test("generates probabilities in the supported range", () => {
    const random = createSecureRandomGenerator();

    for (let attempt = 0; attempt < 100; attempt += 1) {
      expect(random.probability()).toBeGreaterThanOrEqual(0);
      expect(random.probability()).toBeLessThan(1);
    }
  });
});

describe("createSeededRandomGenerator", () => {
  test("produces the same sequence for the same seed", () => {
    const first = createSeededRandomGenerator(42);
    const second = createSeededRandomGenerator(42);

    expect(Array.from({ length: 10 }, () => first.probability())).toEqual(
      Array.from({ length: 10 }, () => second.probability()),
    );
  });

  test("produces different sequences for different seeds", () => {
    const first = createSeededRandomGenerator(1);
    const second = createSeededRandomGenerator(2);

    expect(Array.from({ length: 10 }, () => first.probability())).not.toEqual(
      Array.from({ length: 10 }, () => second.probability()),
    );
  });

  test.each([-1, 0x1_0000_0000, 1.5, Number.NaN, Infinity])(
    "rejects the invalid seed %s",
    (seed) => {
      expect(() => createSeededRandomGenerator(seed)).toThrow(RangeError);
    },
  );
});

describe("chance", () => {
  test("supports the probability boundaries", () => {
    const random = createSeededRandomGenerator(42);

    expect(random.chance(0)).toBe(false);
    expect(random.chance(1)).toBe(true);
  });

  test("supports intermediate probabilities", () => {
    const random: RandomGenerator = {
      chance: (probability) => probability > 0.25,
      integer: () => 0,
      probability: () => 0.25,
      weighted: (entries) => entries[0].value,
    };

    expect(random.chance(0.5)).toBe(true);
  });

  test.each([-1, 1.1, Number.NaN, Infinity])(
    "rejects the invalid probability %s",
    (probability) => {
      expect(() => createSeededRandomGenerator(42).chance(probability)).toThrow(
        RangeError,
      );
    },
  );
});

describe("integer", () => {
  test("includes both boundaries", () => {
    const random = createSeededRandomGenerator(42);
    const values = new Set(
      Array.from({ length: 100 }, () => random.integer(-1, 1)),
    );

    expect(values).toEqual(new Set([-1, 0, 1]));
  });

  test("supports a range with one value", () => {
    expect(createSeededRandomGenerator(42).integer(5, 5)).toBe(5);
  });

  test.each([
    [1.5, 2],
    [1, 2.5],
    [2, 1],
    [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  ])("rejects the invalid range %s to %s", (min, max) => {
    expect(() => createSeededRandomGenerator(42).integer(min, max)).toThrow(
      RangeError,
    );
  });
});

describe("weighted", () => {
  test("selects entries according to their weights", () => {
    const random = createSeededRandomGenerator(42);
    const entries = [
      { value: "common", weight: 8 },
      { value: "rare", weight: 2 },
    ] as const;
    const values = new Set(
      Array.from({ length: 100 }, () => random.weighted(entries)),
    );

    expect(values).toEqual(new Set(["common", "rare"]));
  });

  test("does not select entries with zero weight", () => {
    const random = createSeededRandomGenerator(42);

    expect(
      Array.from({ length: 100 }, () =>
        random.weighted([
          { value: "never", weight: 0 },
          { value: "always", weight: 1 },
        ]),
      ),
    ).toEqual(Array.from({ length: 100 }, () => "always"));
  });

  test.each([
    [[]],
    [[{ value: "invalid", weight: -1 }]],
    [[{ value: "invalid", weight: Number.NaN }]],
    [[{ value: "invalid", weight: Infinity }]],
    [[{ value: "invalid", weight: 0 }]],
  ])("rejects invalid entries %#", (entries) => {
    expect(() => createSeededRandomGenerator(42).weighted(entries)).toThrow(
      RangeError,
    );
  });
});

const UINT32_RANGE = 0x1_0000_0000;

export interface RandomGenerator {
  chance(probability: number): boolean;
  integer(min: number, max: number): number;
  probability(): number;
  weighted<T>(entries: readonly WeightedEntry<T>[]): T;
}

export interface WeightedEntry<T> {
  value: T;
  weight: number;
}

export function createSecureRandomGenerator(): RandomGenerator {
  const values = new Uint32Array(1);

  return createRandomGenerator(() => {
    crypto.getRandomValues(values);
    return values[0];
  });
}

export function createSeededRandomGenerator(seed: number): RandomGenerator {
  validateUint32(seed, "The seed");

  let state = seed;

  return createRandomGenerator(() => {
    state = (state + 0x6d2b79f5) >>> 0;

    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return (value ^ (value >>> 14)) >>> 0;
  });
}

function createRandomGenerator(nextUint32: () => number): RandomGenerator {
  const probability = () => nextUint32() / UINT32_RANGE;

  return {
    chance: (chance) => {
      validateProbability(chance);
      return probability() < chance;
    },
    integer: (min, max) => {
      validateIntegerRange(min, max);

      const range = max - min + 1;
      const limit = UINT32_RANGE - (UINT32_RANGE % range);
      let value: number;

      do {
        value = nextUint32();
      } while (value >= limit);

      return min + (value % range);
    },
    probability,
    weighted: (entries) => {
      const totalWeight = validateWeights(entries);
      const selection = probability() * totalWeight;
      let accumulatedWeight = 0;

      for (const entry of entries) {
        accumulatedWeight += entry.weight;
        if (selection < accumulatedWeight) {
          return entry.value;
        }
      }

      return entries[entries.length - 1].value;
    },
  };
}

function validateProbability(probability: number): void {
  if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
    throw new RangeError(
      "The probability must be a finite number from 0 to 1.",
    );
  }
}

function validateIntegerRange(min: number, max: number): void {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min > max) {
    throw new RangeError(
      "The minimum and maximum must be safe integers in ascending order.",
    );
  }

  if (max - min + 1 > UINT32_RANGE) {
    throw new RangeError(
      "The integer range cannot contain more than 2^32 values.",
    );
  }
}

function validateUint32(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0 || value >= UINT32_RANGE) {
    throw new RangeError(`${name} must be an integer from 0 to 2^32 - 1.`);
  }
}

function validateWeights<T>(entries: readonly WeightedEntry<T>[]): number {
  if (entries.length === 0) {
    throw new RangeError("The weighted entries cannot be empty.");
  }

  let totalWeight = 0;

  for (const entry of entries) {
    if (!Number.isFinite(entry.weight) || entry.weight < 0) {
      throw new RangeError("Each weight must be a finite non-negative number.");
    }

    totalWeight += entry.weight;
  }

  if (!Number.isFinite(totalWeight) || totalWeight === 0) {
    throw new RangeError(
      "The total weight must be finite and greater than zero.",
    );
  }

  return totalWeight;
}

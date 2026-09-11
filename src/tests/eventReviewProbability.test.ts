import { describe, expect, it } from "vitest";

import {
  calculateReviewSuccessChance,
  parseProbabilityWeights,
  serializeProbabilityWeights,
} from "../app/eventReviewProbability";

describe("event review probability", () => {
  it("uses the same neutral value, scale and limits as event probability", () => {
    const weights = parseProbabilityWeights("piloting:0.3;tactics:0.15");

    expect(calculateReviewSuccessChance(55, weights, 0)).toBe(50);
    expect(calculateReviewSuccessChance(55, weights, 10)).toBe(65);
    expect(calculateReviewSuccessChance(55, weights, 30)).toBe(74);
    expect(calculateReviewSuccessChance(55, weights, 100)).toBe(91);
    expect(calculateReviewSuccessChance(90, weights, 100)).toBe(95);
  });

  it("edits probability weights and omits zero values from the CSV", () => {
    const weights = parseProbabilityWeights("synchrony:0.3;piloting:0.15");
    weights.synchrony = 0;
    weights.technique = 0.2;

    expect(serializeProbabilityWeights(weights)).toBe(
      "piloting:0.15;technique:0.2",
    );
  });

  it("includes potential when an event uses it", () => {
    const weights = parseProbabilityWeights("potential:0.3;piloting:0.15");

    expect(calculateReviewSuccessChance(30, weights, 30)).toBe(49);
    expect(serializeProbabilityWeights(weights)).toBe(
      "piloting:0.15;potential:0.3",
    );
  });
});

import { describe, expect, test } from "vitest";

import {
  hasMinimumRank,
  militaryRankLevels,
  rankInsigniaDefinitions,
} from "../domain/ranks";

describe("rank insignias", () => {
  test("uses a distinct PNG for every military rank", () => {
    expect(
      (
        [
          "cadet",
          "soldier",
          "corporal",
          "sergeant",
          "lieutenant",
          "captain",
          "major",
          "commander",
          "general",
        ] as const
      ).map((rank) => rankInsigniaDefinitions[rank].imagePath),
    ).toEqual([
      "/images/ranks/cadet.png",
      "/images/ranks/soldier.png",
      "/images/ranks/corporal.png",
      "/images/ranks/sergeant.png",
      "/images/ranks/lieutenant.png",
      "/images/ranks/captain.png",
      "/images/ranks/major.png",
      "/images/ranks/commander.png",
      "/images/ranks/general.png",
    ]);
  });
});

describe("military rank levels", () => {
  test("orders every rank independently from its name", () => {
    const ranks = [
      "cadet",
      "soldier",
      "corporal",
      "sergeant",
      "lieutenant",
      "captain",
      "major",
      "commander",
      "general",
    ] as const;
    expect(ranks.map((rank) => militaryRankLevels[rank])).toEqual([
      0, 10, 20, 30, 40, 50, 60, 70, 80,
    ]);
    expect(hasMinimumRank("cadet", "soldier")).toBe(false);
    expect(hasMinimumRank("soldier", "soldier")).toBe(true);
    expect(hasMinimumRank("general", "soldier")).toBe(true);
  });
});

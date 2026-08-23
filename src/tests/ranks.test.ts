import { describe, expect, test } from "vitest";

import { rankInsigniaDefinitions } from "../domain/ranks";

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

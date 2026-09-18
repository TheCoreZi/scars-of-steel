import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { updateZoidPowers } from "../../dev/zoidReview";

const source = readFileSync("src/domain/zoids.ts", "utf8");

describe("Zoid review saves", () => {
  it("updates selected powers and preserves all other source text", () => {
    const updated = updateZoidPowers(source, [
      { id: "zoid:aquadon", previous: 10, basePower: 0 },
    ]);
    expect(updated).toBe(
      source.replace(
        'basePower: 10,\n    faction: "helic",\n    id: "aquadon"',
        'basePower: 0,\n    faction: "helic",\n    id: "aquadon"',
      ),
    );
    expect(
      updateZoidPowers(updated, [
        { id: "zoid:aquadon", previous: 0, basePower: 100 },
      ]),
    ).toContain('basePower: 100,\n    faction: "helic",\n    id: "aquadon"');
  });
  it.each([-1, 101, 1.5, "50", null])(
    "rejects invalid power %s",
    (basePower) => {
      expect(() =>
        updateZoidPowers(source, [
          { id: "zoid:aquadon", previous: 10, basePower },
        ]),
      ).toThrow();
    },
  );
  it("rejects stale values and unknown IDs", () => {
    expect(() =>
      updateZoidPowers(source, [
        { id: "zoid:aquadon", previous: 11, basePower: 20 },
      ]),
    ).toThrow("Catalog changed");
    expect(() =>
      updateZoidPowers(source, [
        { id: "zoid:unknown", previous: 10, basePower: 20 },
      ]),
    ).toThrow("Unknown Zoid");
  });
});

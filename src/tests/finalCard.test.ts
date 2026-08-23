import { afterEach, describe, expect, test, vi } from "vitest";

import {
  createFinalCardBlob,
  finalCardHeight,
  finalCardWidth,
} from "../app/finalCard";
import type { FinalSummary } from "../domain/finalSummary";

const summary = {
  achievements: [
    {
      description: "You learned every machine.",
      iconPath: "/images/icons/achievements/wrench.svg",
      name: "Born in the workshop",
    },
  ],
  age: 13,
  ageLabel: "Age 13",
  battleLosses: 3,
  battleWins: 7,
  faction: "helic",
  factionImagePath: "/images/factions/helic.png",
  factionName: "Helic Republic",
  factionTrust: 22,
  fame: 35,
  labels: {
    achievements: "Achievements",
    battleRecord: "Battle record",
    factionTrust: "Faction trust",
    fame: "Fame",
    losses: "Losses",
    potential: "Potential",
    stats: "Final stats",
    wins: "Wins",
    zoid: "Signature Zoid",
  },
  pilotName: "Lena",
  potential: 8,
  rank: "Cadet",
  rankInsignia: {
    imagePath: "/images/ranks/cadet.png",
  },
  stats: [
    { label: "Charisma", value: 5 },
    { label: "Piloting", value: 5 },
    { label: "Strength", value: 5 },
    { label: "Synchrony", value: 5 },
    { label: "Tactics", value: 5 },
    { label: "Technique", value: 5 },
  ],
  titleDescription: "The Guardian arrived with potential.",
  titleIconPath: "/images/icons/titles/false-promise.png",
  titleName: "False promise",
  zoidImagePath: "/images/zoids/godos.png",
  zoidName: "Godos",
} as const satisfies FinalSummary;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("final card renderer", () => {
  test("renders the final summary to a 1200 by 1500 PNG", async () => {
    const dimensions: number[][] = [];
    const fillText = vi.fn();
    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText,
      measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
      rotate: vi.fn(),
      restore: vi.fn(),
      save: vi.fn(),
      strokeRect: vi.fn(),
      translate: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      function (this: HTMLCanvasElement, callback) {
        dimensions.push([this.width, this.height]);
        callback(new Blob(["png"], { type: "image/png" }));
      },
    );
    vi.stubGlobal(
      "Image",
      class {
        height = 100;
        onerror: (() => void) | null = null;
        onload: (() => void) | null = null;
        width = 100;

        set src(_path: string) {
          queueMicrotask(() => this.onload?.());
        }
      },
    );

    const blob = await createFinalCardBlob(summary);
    const canvas = document.querySelector("canvas");

    expect(blob.type).toBe("image/png");
    expect(canvas).toBeNull();
    expect(finalCardWidth).toBe(1200);
    expect(finalCardHeight).toBe(1500);
    expect(dimensions).toEqual([[1200, 1500]]);
    expect(fillText).toHaveBeenCalledWith("False promise", 370, 250);
    expect(context.rotate).toHaveBeenCalledTimes(3);
    expect(context.translate).toHaveBeenCalledWith(332, 195);
    expect(context.translate).toHaveBeenCalledWith(370, 195);
    expect(context.translate).toHaveBeenCalledWith(408, 195);
    expect(fillText).toHaveBeenCalledWith(summary.titleDescription, 370, 298);
    expect(context.drawImage).toHaveBeenCalledWith(
      expect.anything(),
      1019.5,
      104,
      51,
      51,
    );
    expect(fillText).toHaveBeenCalledWith("CADET", 1085, 174);
    expect(fillText).toHaveBeenCalledWith("7 Wins · 3 Losses", 628, 756);
    expect(fillText).toHaveBeenCalledWith("Born in the workshop", 126, 887);
    expect(fillText).toHaveBeenCalledWith(
      "You learned every machine.",
      126,
      915,
    );

    await createFinalCardBlob({
      ...summary,
      titleName:
        "False promise that became an exceptionally long final career title for the nation",
    });

    expect(fillText).toHaveBeenCalledWith(summary.titleDescription, 370, 362);
  });

  test("keeps a special rank name next to its insignia", async () => {
    const fillText = vi.fn();
    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText,
      measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
      rotate: vi.fn(),
      restore: vi.fn(),
      save: vi.fn(),
      strokeRect: vi.fn(),
      translate: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      context as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      function (this: HTMLCanvasElement, callback) {
        callback(new Blob([String(this.width)], { type: "image/png" }));
      },
    );
    vi.stubGlobal(
      "Image",
      class {
        onerror: (() => void) | null = null;
        onload: (() => void) | null = null;

        set src(_path: string) {
          queueMicrotask(() => this.onload?.());
        }
      },
    );

    await createFinalCardBlob({
      ...summary,
      rank: "Leo Master",
    });

    expect(fillText).toHaveBeenCalledWith("LEO MASTER", 1085, 174);
  });
});

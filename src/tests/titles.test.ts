import { describe, expect, test } from "vitest";

import { createCareerHistory } from "../domain/career";
import { createInitialPilot } from "../domain/pilot";
import {
  getTitleDefinition,
  selectTitle,
  titleCatalog,
} from "../domain/titles";
import {
  createBoundedValue,
  type CareerEndReason,
  type CareerHistory,
  type MilitaryRank,
  type Pilot,
} from "../domain/types";

const basePilot = createInitialPilot({
  aspiration: "commander",
  faction: "helic",
  id: "pilot:title-test",
  name: "Lena",
});

function select(
  pilotChanges: Partial<Pilot> = {},
  history: CareerHistory = createCareerHistory(),
  endReason: CareerEndReason = "no-eligible-events",
) {
  return selectTitle(
    { ...basePilot, age: 20, ...pilotChanges },
    history,
    endReason,
  );
}

function withCareer(
  changes: Partial<Pilot["career"]>,
  militaryRank: MilitaryRank = "cadet",
): Pilot["career"] {
  return { ...basePilot.career, militaryRank, ...changes };
}

describe("final title priority", () => {
  test("assigns a distinct icon to every title", () => {
    expect(new Set(titleCatalog.map(({ iconPath }) => iconPath)).size).toBe(
      titleCatalog.length,
    );
    expect(getTitleDefinition("title:champion").iconPath).toBe(
      "/images/icons/titles/champion.png",
    );
    expect(getTitleDefinition("title:false-promise").iconPath).toBe(
      "/images/icons/titles/false-promise.png",
    );
    expect(getTitleDefinition("title:puppeteer").iconPath).toBe(
      "/images/icons/titles/puppeteer.png",
    );
    expect(getTitleDefinition("title:voice-of-command").iconPath).toBe(
      "/images/icons/titles/voice-of-command.png",
    );
  });

  test("prioritizes a famous martyr over an unfinished academy", () => {
    expect(
      select(
        {
          age: 13,
          career: withCareer({ fame: createBoundedValue(80) }),
          condition: "dead",
        },
        undefined,
        "dead",
      ),
    ).toBe("title:martyr");
  });

  test("prioritizes the war result over an unfinished academy", () => {
    expect(select({ age: 13 }, undefined, "war-won")).toBe("title:champion");
    expect(select({ age: 13 }, undefined, "war-lost")).toBe(
      "title:solid-pilot",
    );
  });

  test("uses false promise when the run ends during academy", () => {
    expect(select({ age: 13 })).toBe("title:false-promise");
  });

  test("uses the ordered future career rules", () => {
    expect(select({ career: withCareer({ specialRank: "traitor" }) })).toBe(
      "title:puppeteer",
    );
    expect(select({ age: 50 }, undefined, "retired")).toBe("title:veteran");
    expect(
      select({
        career: withCareer({}, "major"),
        potential: createBoundedValue(91),
      }),
    ).toBe("title:living-legend");
    expect(select({ career: withCareer({}, "general") })).toBe(
      "title:voice-of-command",
    );
    expect(
      select({ career: withCareer({ fame: createBoundedValue(90) }) }),
    ).toBe("title:nation-idol");
    expect(select({ potential: createBoundedValue(90) })).toBe(
      "title:war-hero",
    );
    expect(
      select(
        {},
        {
          ...createCareerHistory(),
          battles: { losses: 2, participated: 10, wins: 8 },
        },
      ),
    ).toBe("title:spear-of-zi");
    expect(
      select({
        career: withCareer({ factionTrust: createBoundedValue(90) }),
      }),
    ).toBe("title:nation-ace");
    expect(select()).toBe("title:village-hero");
  });

  test("requires a participated battle for spear of Zi", () => {
    expect(select({}, createCareerHistory())).toBe("title:village-hero");
  });
});

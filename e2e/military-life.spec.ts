import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

test("adds a military reward to reserve and restores it after reload", async ({
  page,
}, testInfo) => {
  await openMilitaryEvent(page, "retiring-pilot", []);
  await expect(
    page.getByRole("heading", { name: "Someone Must Pilot It" }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("military-decision.png"),
    fullPage: true,
  });
  await page.locator(".decision-option").first().click();
  await expect(
    page
      .locator(".outcome-screen__rewards")
      .getByText("Gunbluster", { exact: true }),
  ).toBeVisible();
  const image = page.locator('img[src$="/gunbluster.png"]').first();
  await expect(image).toBeVisible();
  expect(
    await image.evaluate((img) => (img as HTMLImageElement).naturalWidth),
  ).toBeGreaterThan(0);
  const before = await readActiveGame(page);
  expect(before.pilot.zoids.signatureId).toBe("zoid:godos");
  expect(before.pilot.zoids.reserveIds).toEqual(["zoid:gunbluster"]);
  await page.reload();
  await expect(
    page
      .locator(".outcome-screen__rewards")
      .getByText("Gunbluster", { exact: true }),
  ).toBeVisible();
  expect(await readActiveGame(page)).toEqual(before);
  await audit(page);
  await page.screenshot({
    path: testInfo.outputPath("military-reward.png"),
    fullPage: true,
  });
});

test("reports a narrative destruction while retaining a reserve", async ({
  page,
}, testInfo) => {
  await openMilitaryEvent(page, "trapped-core", ["zoid:command-wolf"]);
  await page.locator(".decision-option").nth(2).click();
  await expect(page.getByText("Your active Zoid was destroyed.")).toBeVisible();
  const game = await readActiveGame(page);
  expect(game.pilot.zoids.signatureId).toBe("zoid:command-wolf");
  expect(game.result.zoidIds).toEqual([]);
  expect(game.pilot.zoids.reserveIds).toEqual([]);
  await audit(page);
  await page.screenshot({
    path: testInfo.outputPath("military-destruction.png"),
    fullPage: true,
  });
});

test("keeps the rescued Core in a new upgraded body", async ({ page }) => {
  await openMilitaryEvent(page, "trapped-core", ["zoid:command-wolf"]);
  await page.locator(".decision-option").nth(1).click();
  await expect(
    page
      .locator(".outcome-screen__rewards")
      .getByText("Aquadon", { exact: true }),
  ).toBeVisible();
  const game = await readActiveGame(page);
  expect(game.pilot.zoids.signatureId).toBe("zoid:aquadon");
  expect(game.pilot.zoids.reserveIds).toEqual(["zoid:command-wolf"]);
  expect(game.pilot.zoidProgress["zoid:aquadon"].upgrades).toBe(1);
  expect(game.pilot.zoidProgress["zoid:godos"]).toBeUndefined();
  await expect(page.getByText("Your active Zoid was destroyed.")).toHaveCount(
    0,
  );
});

async function openMilitaryEvent(
  page: Page,
  event: string,
  reserveIds: string[],
) {
  await page.addInitScript(() => {
    window.localStorage.setItem("scars-of-steel:language", "en");
    Object.defineProperty(window.crypto, "getRandomValues", {
      configurable: true,
      value: (values: Uint32Array) => {
        values.fill(0);
        return values;
      },
    });
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(
    async ({ event, reserveIds }) => {
      const pilotModule = "/src/domain/pilot.ts";
      const careerModule = "/src/domain/career.ts";
      const { calculatePotential, createInitialPilot } = await import(
        pilotModule
      );
      const { createCareerHistory } = await import(careerModule);
      const original = createInitialPilot({
        aspiration: "zoid-ace",
        faction: "helic",
        id: "pilot:military-browser",
        name: "Military Pilot",
      });
      const pilot = {
        ...original,
        age: 21,
        // Keep the cadet rank so these tests isolate narrative rewards from annual battles.
        career: original.career,
        stats: {
          charisma: 30,
          piloting: 30,
          strength: 30,
          synchrony: 30,
          tactics: 30,
          technique: 30,
        },
        zoids: { signatureId: "zoid:godos", reserveIds, damagedIds: [] },
        zoidProgress: { "zoid:godos": { power: 80, upgrades: 3 } },
      };
      pilot.potential = calculatePotential(pilot);
      window.localStorage.setItem(
        "scars-of-steel:game-data",
        JSON.stringify({
          activeGame: {
            eventId: `event:military-life-${event}`,
            history: createCareerHistory(),
            phase: "choosing",
            pilot,
            screen: "event",
          },
          completedGames: [],
        }),
      );
    },
    { event, reserveIds },
  );
  await page.reload();
  await expect(page.locator(".decision-screen__choices")).toBeVisible();
}

async function readActiveGame(page: Page) {
  return page.evaluate(
    () =>
      JSON.parse(window.localStorage.getItem("scars-of-steel:game-data")!)
        .activeGame,
  );
}

async function audit(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
}

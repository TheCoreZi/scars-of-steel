import { expect, type Page } from "@playwright/test";

// Keep navigation tests running through every age. Domain tests cover early career endings.
export async function stabilizeCareer(page: Page) {
  await page.evaluate(async () => {
    const storageKey = "scars-of-steel:game-data";
    const storedValue = window.localStorage.getItem(storageKey);
    if (!storedValue) throw new Error("Expected persisted game data.");
    const data = JSON.parse(storedValue);
    const activeGame = data.activeGame;
    if (!activeGame?.pilot) throw new Error("Expected an active pilot.");
    const pilotModule = "/src/domain/pilot.ts";
    const { calculatePotential } = await import(pilotModule);
    const pilot = activeGame.pilot;
    pilot.career.warState = {
      intensity: "low",
      sides: [
        { control: 50, faction: "helic" },
        { control: 50, faction: "guylos" },
      ],
    };
    pilot.condition = "active";
    pilot.injuryCount = 0;
    pilot.zoids ??= {
      damagedIds: [],
      reserveIds: [],
      signatureId: pilot.faction === "helic" ? "zoid:godos" : "zoid:molga",
    };
    pilot.zoids.damagedIds = [];
    pilot.potential = calculatePotential(pilot);
    if (activeGame.result) activeGame.result.pilotAfter = pilot;
    window.localStorage.setItem(storageKey, JSON.stringify(data));
  });
  await page.reload();
  await expect(page.locator(".outcome-screen h1")).toBeFocused();
}

import { expect, test, type Page, type TestInfo } from "@playwright/test";

const gameStorageKey = "scars-of-steel:game-data";
const failureRandomValue = 4_294_967_290;

const safeEventCases = [
  {
    eventIndex: 0,
    faction: "Guylos Empire",
    factionId: "guylos",
    title: "Assignment Day",
    zoidId: "zoid:brachios",
    zoidName: "Brachios",
  },
  {
    eventIndex: 1,
    faction: "Helic Republic",
    factionId: "helic",
    title: "Defend the Camp",
    zoidId: "zoid:barigator",
    zoidName: "Barigator",
  },
  {
    eventIndex: 2,
    faction: "Guylos Empire",
    factionId: "guylos",
    title: "Mechanics and Maintenance Program",
    zoidId: "zoid:black-rhymos",
    zoidName: "Black Rhymos",
  },
  {
    eventIndex: 3,
    faction: "Helic Republic",
    factionId: "helic",
    title: "The Offer",
    zoidId: "zoid:bigasaurus",
    zoidName: "Bigasaurus",
  },
  {
    eventIndex: 4,
    faction: "Guylos Empire",
    factionId: "guylos",
    title: "Humanitarian Mission",
    zoidId: "zoid:brachios",
    zoidName: "Brachios",
  },
] as const;

interface GameSnapshot {
  active: boolean;
  age: number;
  eventId: string;
  faction: string;
  outcomeId: string | null;
  phase: string | null;
  resolution: {
    decisionId: string;
    outcomeId: string;
    result?: "failure" | "success";
    roll?: number;
  } | null;
  zoidId: string | null;
}

for (const eventCase of safeEventCases) {
  test(`completes ${eventCase.title} through a safe decision`, async ({
    page,
  }, testInfo) => {
    skipOutsideDesktop(testInfo);
    await useConstantRandomValue(page, eventCase.eventIndex);
    await beginCareer(page, eventCase.faction);

    await expect(
      page.getByRole("heading", { name: eventCase.title }),
    ).toBeFocused();
    await selectSafeDecision(page);
    await expect(
      page.getByRole("heading", { name: "Decision · Without risk" }),
    ).toBeFocused();
    await expect(
      page.locator(".outcome-screen__rewards").getByText(eventCase.zoidName),
    ).toBeVisible();

    const outcome = await readGameSnapshot(page);
    expect(outcome).toMatchObject({
      active: true,
      age: 12,
      eventId: `event:${getEventId(eventCase.eventIndex)}`,
      faction: eventCase.factionId,
      phase: "outcome",
      zoidId: eventCase.zoidId,
    });

    await finishCareer(page);
    const completed = await readGameSnapshot(page);
    expect(completed).toMatchObject({
      active: false,
      age: 13,
      eventId: outcome.eventId,
      faction: eventCase.factionId,
      zoidId: eventCase.zoidId,
    });
    await expect(
      page.getByText("You fought for 1 year. Your career ended at age 13."),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Continue career" }),
    ).toHaveCount(0);
    await expect(page.locator(".decision-option")).toHaveCount(0);

    await page.getByRole("button", { name: "New run" }).click();
    await expect(
      page.getByRole("button", { name: "Begin your career" }),
    ).toBeVisible();
  });
}

test("restores the selected event before a successful roll", async ({
  page,
}, testInfo) => {
  skipOutsideDesktop(testInfo);
  await useConstantRandomValue(page, 0);
  await beginCareer(page, "Helic Republic");
  const beforeReload = await readGameSnapshot(page);

  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Assignment Day" }),
  ).toBeFocused();
  expect(await readGameSnapshot(page)).toEqual(beforeReload);

  await selectChanceDecision(page);
  await expect(page.locator(".resolution-screen__indicator")).toHaveAttribute(
    "data-result",
    "success",
  );
  await expect(
    page.getByRole("heading", { name: "Decision · With risk · Success" }),
  ).toBeFocused();
  await finishCareer(page);
});

test("restores the exact failed result after the roll", async ({
  page,
}, testInfo) => {
  skipOutsideDesktop(testInfo);
  await useConstantRandomValue(page, failureRandomValue);
  await beginCareer(page, "Guylos Empire");
  await selectChanceDecision(page);
  await expect(page.locator(".resolution-screen__indicator")).toHaveAttribute(
    "data-result",
    "failure",
  );

  const resolved = await readGameSnapshot(page);
  expect(resolved).toMatchObject({
    active: true,
    eventId: "event:first-exercises",
    faction: "guylos",
    outcomeId: "outcome:firstExercisesControlRareFailure",
    phase: "animating",
    resolution: {
      decisionId: "decision:first-exercises-control-rare",
      outcomeId: "outcome:firstExercisesControlRareFailure",
      result: "failure",
    },
  });
  expect(resolved.resolution?.roll).toBeGreaterThan(99);
  expect(resolved.zoidId).not.toBeNull();

  await page.reload();
  expect(await readGameSnapshot(page)).toEqual(resolved);
  await expect(
    page.getByRole("heading", { name: "Decision · With risk · Failure" }),
  ).toBeFocused();

  const restored = await readGameSnapshot(page);
  expect(restored).toMatchObject({
    outcomeId: resolved.outcomeId,
    phase: "outcome",
    resolution: resolved.resolution,
    zoidId: resolved.zoidId,
  });
  await finishCareer(page);
});

async function beginCareer(page: Page, faction: string) {
  await page.goto("/");
  await page.getByRole("button", { name: "Begin your career" }).click();
  await page
    .getByRole("textbox", { name: "Recruit name" })
    .fill("Integration Pilot");
  await page
    .getByRole("radio", { name: faction })
    .evaluate((element) => (element as HTMLInputElement).click());
  await page
    .getByRole("radio", { name: "Commander" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await page.getByRole("button", { name: "Submit enlistment" }).click();
}

async function selectSafeDecision(page: Page) {
  await page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--safe") })
    .first()
    .click();
}

async function finishCareer(page: Page) {
  await page.getByRole("button", { name: "Continue career" }).click();
  await expect(page.locator(".final-screen h1")).toBeFocused();
}

async function selectChanceDecision(page: Page) {
  await page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--chance") })
    .first()
    .click();
}

async function useConstantRandomValue(page: Page, randomValue: number) {
  await page.addInitScript((value) => {
    Object.defineProperty(globalThis.crypto, "getRandomValues", {
      configurable: true,
      value: (array: Uint32Array) => {
        array.fill(value);
        return array;
      },
    });
  }, randomValue);
}

async function readGameSnapshot(page: Page): Promise<GameSnapshot> {
  return page.evaluate((storageKey) => {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      throw new Error("Expected persisted game data.");
    }

    const data = JSON.parse(storedValue);
    const active = data.activeGame !== null;
    const state = data.activeGame ?? data.completedGames[0]?.state;

    if (!state) {
      throw new Error("Expected an active or completed game.");
    }

    return {
      active,
      age: state.pilot.age,
      eventId: state.eventId ?? state.history.completedEventIds[0],
      faction: state.pilot.faction,
      outcomeId: state.result?.outcome.id ?? null,
      phase: state.phase ?? null,
      resolution: state.result?.resolution ?? null,
      zoidId: state.pilot.zoids?.signatureId ?? null,
    };
  }, gameStorageKey);
}

function getEventId(eventIndex: number) {
  return [
    "first-exercises",
    "stray-zoid",
    "mechanics-program",
    "veteran-offer",
    "humanitarian-mission",
  ][eventIndex];
}

function skipOutsideDesktop(testInfo: TestInfo) {
  test.skip(testInfo.project.name !== "desktop-1280");
}

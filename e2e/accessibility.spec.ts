import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

test("keeps every screen accessible and free of horizontal overflow", async ({
  page,
}) => {
  await page.goto("/");
  await auditCurrentScreen(page, "welcome");
  await expect(
    page.getByRole("navigation", { name: "Application controls" }),
  ).toBeVisible();
  await expect(
    page.getByRole("contentinfo", { name: "Fan project notice" }),
  ).toBeAttached();

  await page.getByRole("button", { name: "Begin your career" }).click();
  await auditCurrentScreen(page, "pilot creation");
  await expect(
    page.getByRole("contentinfo", { name: "Fan project notice" }),
  ).toBeAttached();
  await completePilotCreation(page);
  await auditCurrentScreen(page, "decision selection");

  const chanceDecision = page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--chance") })
    .first();
  const safeDecision = page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--safe") })
    .first();

  await expect(chanceDecision).toHaveAccessibleName(
    /Success \d+%, failure \d+%/u,
  );
  await expect(safeDecision).toHaveAccessibleName(/Safe\.$/u);
  await safeDecision.click();

  await expect(page.locator(".outcome-screen h1")).toBeFocused();
  await auditCurrentScreen(page, "decision outcome");
  await page.getByRole("button", { name: "Continue career" }).click();

  await expect(page.locator(".final-screen h1")).toBeFocused();
  await auditCurrentScreen(page, "final screen");

  await page.getByRole("button", { name: "New run" }).click();
  await page.getByRole("button", { name: "Expand service records" }).click();
  await auditCurrentScreen(page, "service records");
});

test("completes the full flow with the keyboard", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280");
  await page.goto("/");

  const startButton = page.getByRole("button", { name: "Begin your career" });
  await focusWithTab(page, startButton);
  await page.keyboard.press("Enter");

  await expect(page.locator(".pilot-creation h1")).toBeFocused();
  const nameInput = page.getByRole("textbox", { name: "Recruit name" });
  await focusWithTab(page, nameInput);
  await page.keyboard.type("Keyboard Pilot");

  const faction = page.getByRole("radio", { name: "Guylos Empire" });
  await focusWithTab(page, faction);
  await page.keyboard.press("Space");

  const aspiration = page.getByRole("radio", { name: "Commander" });
  await focusWithTab(page, aspiration);
  await page.keyboard.press("Space");

  const submitButton = page.getByRole("button", { name: "Submit enlistment" });
  await focusWithTab(page, submitButton);
  await page.keyboard.press("Enter");

  await expect(page.locator(".decision-screen__heading h1")).toBeFocused();
  const safeDecision = page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--safe") })
    .first();
  await focusWithTab(page, safeDecision);
  await page.keyboard.press("Enter");

  await expect(page.locator(".outcome-screen h1")).toBeFocused();
  const continueButton = page.getByRole("button", {
    name: "Continue career",
  });
  await focusWithTab(page, continueButton);
  await page.keyboard.press("Enter");

  await expect(page.locator(".final-screen h1")).toBeFocused();
});

test("contains and restores focus for the abandon dialog", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280");
  await page.goto("/");

  await page.getByRole("button", { name: "Begin your career" }).click();
  await completePilotCreation(page);
  await page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--safe") })
    .first()
    .click();

  const abandonButton = page.getByRole("button", { name: "Abandon run" });
  await abandonButton.click();

  const dialog = page.getByRole("alertdialog", { name: "Abandon this run?" });
  const cancelButton = dialog.getByRole("button", { name: "Keep playing" });
  const confirmButton = dialog.getByRole("button", { name: "Abandon run" });
  await expect(cancelButton).toBeFocused();

  await page.keyboard.press("Shift+Tab");
  await expect
    .poll(() =>
      dialog.evaluate(
        (element) =>
          element === document.activeElement ||
          element.contains(document.activeElement),
      ),
    )
    .toBe(true);
  await focusWithTab(page, confirmButton);
  await page.keyboard.press("Escape");

  await expect(dialog).toBeHidden();
  await expect(abandonButton).toBeFocused();
});

test("uses the system reduced-motion preference", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Begin your career" }).click();
  await completePilotCreation(page);

  await page
    .locator(".decision-option")
    .filter({ has: page.locator(".decision-option__kind--chance") })
    .first()
    .click();

  await expect(page.locator(".resolution-screen")).toHaveAttribute(
    "data-reduced-motion",
    "true",
  );
  await expect(page.locator(".resolution-screen h1")).toBeFocused();
  await expect(page.locator(".resolution-screen__indicator")).toHaveAttribute(
    "data-visible",
    "true",
  );
});

test("keeps alternate language and color mode accessible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("switch", { name: "Light mode" }).click();
  await page.getByRole("button", { name: "Spanish" }).click();

  await expect(
    page.getByRole("navigation", { name: "Controles de la aplicación" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Cicatrices de Acero" }),
  ).toBeVisible();
  await auditCurrentScreen(page, "Spanish light welcome");
});

test("keeps every faction option contrast state accessible", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-1280");
  await page.goto("/");
  await page.getByRole("button", { name: "Begin your career" }).click();
  await expect(
    page.locator('[data-motion]:not([data-motion="current"])'),
  ).toHaveCount(0);
  await page
    .getByRole("radio", { name: "Guylos Empire" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await auditFactionOptions(page, "dark Guylos faction option");

  await page
    .getByRole("radio", { name: "Helic Republic" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await auditFactionOptions(page, "dark Helic faction option");

  await page.getByRole("switch", { name: "Light mode" }).click();
  await auditFactionOptions(page, "light Helic faction option");

  await page
    .getByRole("radio", { name: "Guylos Empire" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await auditFactionOptions(page, "light Guylos faction option");
});

async function auditFactionOptions(page: Page, stateName: string) {
  const results = await new AxeBuilder({ page })
    .include(".pilot-creation__option-grid--factions")
    .analyze();

  expect(
    results.violations,
    formatViolations(results.violations, stateName),
  ).toEqual([]);
}

async function auditCurrentScreen(page: Page, screenName: string) {
  await page.waitForTimeout(350);
  await expect(
    page.locator('[data-motion]:not([data-motion="current"])'),
  ).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);

  const smallTargets = await page
    .locator("button:visible")
    .evaluateAll((buttons) =>
      buttons
        .map((button) => ({
          height: button.getBoundingClientRect().height,
          name: button.getAttribute("aria-label") ?? button.textContent,
          width: button.getBoundingClientRect().width,
        }))
        .filter(({ height, width }) => height < 48 || width < 48),
    );

  expect(
    smallTargets,
    `${screenName}: interactive targets below 48 pixels`,
  ).toEqual([]);

  const escapedMetrics = await page
    .locator(".service-records__row")
    .evaluateAll((rows) =>
      rows.flatMap((row) => {
        const rowBounds = row.getBoundingClientRect();

        return [...row.querySelectorAll(".service-records__metric")]
          .filter((metric) => {
            const metricBounds = metric.getBoundingClientRect();

            return (
              metricBounds.left < rowBounds.left ||
              metricBounds.right > rowBounds.right
            );
          })
          .map((metric) => metric.textContent);
      }),
    );

  expect(
    escapedMetrics,
    `${screenName}: history metrics outside their row`,
  ).toEqual([]);

  const results = await new AxeBuilder({ page }).analyze();

  expect(
    results.violations,
    formatViolations(results.violations, screenName),
  ).toEqual([]);
}

function formatViolations(
  violations: Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"],
  screenName: string,
) {
  return `${screenName}: ${violations
    .map(({ help, id, nodes }) => `${id} (${nodes.length}): ${help}`)
    .join("; ")}`;
}

async function completePilotCreation(page: Page) {
  await page
    .getByRole("textbox", { name: "Recruit name" })
    .fill("Alexandria Steelbreaker");
  await page
    .getByRole("radio", { name: "Guylos Empire" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await page
    .getByRole("radio", { name: "Commander" })
    .evaluate((element) => (element as HTMLInputElement).click());
  await page.getByRole("button", { name: "Submit enlistment" }).click();
  await expect(page.locator(".decision-screen__heading h1")).toBeFocused();
}

async function focusWithTab(page: Page, target: Locator) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (
      await target.evaluate((element) => element === document.activeElement)
    ) {
      return;
    }

    await page.keyboard.press("Tab");
  }

  throw new Error(
    "The target did not receive focus through keyboard navigation.",
  );
}

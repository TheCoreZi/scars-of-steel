import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("reviews the complete Zoid catalog with editable power and sorting", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("scars-of-steel:language", "en"),
  );
  await page.goto("/?review-zoids=1");
  const cards = page.locator(".zoid-review__card");
  await expect(cards).toHaveCount(68);
  const powers = (await cards.locator("output").allTextContents()).map(Number);
  expect(powers).toEqual([...powers].sort((a, b) => b - a));
  await page.getByLabel("Sort by").selectOption("name");
  await expect(cards.first().getByRole("heading")).toHaveText("Aquadon");
  const slider = page.getByRole("slider", {
    name: "Base power of Aquadon",
    exact: true,
  });
  await slider.fill("100");
  await expect(slider).toHaveValue("100");
  await page.getByLabel("Sort by").selectOption("power");
  await expect(cards.first().getByRole("heading")).toHaveText("Aquadon");
  await slider.fill("0");
  await expect(cards.first().getByRole("heading")).toHaveText("Aquadon");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toBeFocused();
  await expect(cards.first().getByRole("heading")).toHaveText("Aquadon");
  await page.getByRole("button", { name: "Reorder", exact: true }).click();
  await expect(cards.last().getByRole("heading")).toHaveText("Aquadon");
  await page.getByLabel("Sort by").selectOption("faction");
  await expect(cards.first()).toContainText("Guylos");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.screenshot({
    path: `/tmp/zoid-review-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.reload();
  await expect(slider).toHaveValue("10");
});

test("saves edits through the DEV endpoint and reports failures", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem("scars-of-steel:language", "en"),
  );
  await page.goto("/?review-zoids=1");
  await page.route("**/__dev/zoid-powers", async (route) => {
    expect(route.request().postDataJSON()).toEqual([
      { id: "zoid:aquadon", previous: 10, basePower: 11 },
    ]);
    await route.fulfill({ status: 200, body: "{}" });
  });
  await page
    .getByRole("slider", { name: "Base power of Aquadon", exact: true })
    .fill("11");
  await page.getByRole("button", { name: "Save to zoids.ts" }).click();
  await expect(page.locator('p[role="status"]')).toHaveText("Catalog saved.");
  await page.unroute("**/__dev/zoid-powers");
  await page.route("**/__dev/zoid-powers", (route) =>
    route.fulfill({ status: 400 }),
  );
  await page.getByRole("button", { name: "Save to zoids.ts" }).click();
  await expect(page.locator('p[role="status"]')).toContainText(
    "Could not save",
  );
});

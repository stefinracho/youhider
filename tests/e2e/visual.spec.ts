import { expect, test } from "./fixtures";
import { SCENARIOS } from "./scenarios";

test.describe("Visual Regressions Tests", () => {
  for (const scenario of SCENARIOS) {
    test(`${scenario.settingId}-${scenario.variant}`, async ({
      page,
      context,
      extensionId,
    }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      if (scenario.url)
        await page.goto(scenario.url, { waitUntil: "domcontentloaded" });

      const popupPage = await context.newPage();
      await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);
      const checkbox = popupPage.locator(`#checkbox-${scenario.settingId}`);
      await expect(checkbox).toBeVisible();
      if (!(await checkbox.isChecked())) await checkbox.check();
      await popupPage.close();

      await page.bringToFront();

      if (scenario.beforeTest) await scenario.beforeTest(page);

      await expect(
        page.locator(`html[data-yh-${scenario.settingId}]`),
      ).toBeAttached();

      const targetLocator = scenario.snapshotContainer(page);
      await targetLocator.waitFor({ state: "attached" });

      if (scenario.prepareElement)
        await scenario.prepareElement(page, targetLocator);

      await expect(targetLocator).toBeVisible();

      await targetLocator.scrollIntoViewIfNeeded();

      const box = await targetLocator.boundingBox();
      if (!box) throw new Error("Target element not found for bounding box.");

      await expect(page).toHaveScreenshot(
        `${scenario.settingId}-${scenario.variant.replace(/\s+/g, "-").toLowerCase()}.png`,
        {
          clip: box,
          maxDiffPixelRatio: 0.02,
        },
      );
    });
  }
});

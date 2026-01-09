import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    const pathToExtension = path.join(
      import.meta.dirname,
      "../../.output/chrome-mv3",
    );
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium",
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
        `--lang=en-US`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    const page = await context.newPage();

    const language = await page.evaluate(() => navigator.language);
    if (language != "en-US")
      throw new Error(`Language "${language}" not en-US`);

    await page.goto("chrome://extensions");

    const extensionItem = page.locator("extensions-item", {
      hasText: "YouHider",
    });
    const extensionId = await extensionItem.getAttribute("id");
    if (!extensionId) {
      throw new Error(
        "Failed to find extension ID for 'YouHider' on chrome://extensions",
      );
    }

    await page.close();
    await use(extensionId);
  },
});
export const expect = test.expect;

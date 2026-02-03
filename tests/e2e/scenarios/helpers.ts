import { Locator, Page } from "@playwright/test";
import { ScenarioBlueprint, VisualScenario } from "./types";
import { forceStableLayout } from "../utils";
import { SettingId } from "@/utils/settings";

export const URLS = {
  HOME: "https://www.youtube.com/",
  VIDEO: {
    ME_AT_THE_ZOO: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
};

export function defineScenarios(
  settingId: SettingId,
  blueprints: ScenarioBlueprint[],
): VisualScenario[] {
  return blueprints.map((blueprint) => ({ ...blueprint, settingId }));
}

export function stabilizeMetadata(
  dateText: string = "1 month ago",
  viewText: string = "9,999 views",
) {
  return async function (_page: Page, target: Locator) {
    await forceStableLayout(target, { width: 300, height: 30 });

    const dateElement = target.getByText(/ago/).first();
    const viewElement = target.getByText(/view/).first();

    await dateElement.evaluate((node, text) => {
      node.textContent = text;
    }, dateText);
    await viewElement.evaluate((node, text) => {
      node.textContent = text;
    }, viewText);
  };
}

export function seedHomeFeed() {
  return async function (page: Page) {
    await page.goto(URLS.VIDEO.ME_AT_THE_ZOO);
    await page.waitForTimeout(5000); // Play video to record 'history'
    await page.goto(URLS.HOME);
    await page.locator("ytd-rich-item-renderer").first().waitFor();
  };
}

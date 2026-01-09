import { Locator, Page } from "@playwright/test";
import { forceStableLayout } from "./utils";

export type VisualScenario = {
  name: string;
  settingId: string;
  url: string;
  target: (page: Page) => Locator;
  setup?: (page: Page, target: Locator) => Promise<void>;
};

const hideRelatedVideosScenarios: VisualScenario[] = [
  {
    name: "Hide Related Videos",
    settingId: "hiderelatedvideos",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    target: (page: Page) => {
      return page.locator("#related.style-scope.ytd-watch-flexy");
    },
    setup: async (_page: Page, target: Locator) => {
      await target.waitFor({ state: "attached" });

      await forceStableLayout(target, { width: 50, height: 100 });
    },
  },
];

const hideViewCountScenarios: VisualScenario[] = [
  {
    name: "Hide View Count (Related)",
    settingId: "hideviewcount",
    url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    target: (page: Page) => {
      return page
        .locator(".yt-content-metadata-view-model__metadata-row")
        .filter({ hasText: /views|ago/ })
        .first();
    },
    setup: async (_page: Page, target: Locator) => {
      await target.waitFor({ state: "attached" });

      await forceStableLayout(target, { width: 300, height: 30 });

      const dateElement = target.getByText(/ago/).first();
      await dateElement.evaluate((node) => {
        node.textContent = "1 month ago"; // Arbitrary
      });
    },
  },
];

export const SCENARIOS: VisualScenario[] = [
  ...hideRelatedVideosScenarios,
  ...hideViewCountScenarios,
];

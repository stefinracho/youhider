import { Locator, Page } from "@playwright/test";
import { forceStableLayout } from "./utils";

const TEST_VIDEO_URL = "https://www.youtube.com/watch?v=jNQXAC9IVRw"; // Me at the zoo

export type VisualScenario = {
  settingId: string;
  name: string;
  url: string;
  target: (page: Page) => Locator;
  setup?: (page: Page, target: Locator) => Promise<void>;
};

type ScenarioBlueprint = Omit<VisualScenario, "settingId">;

function defineScenarios(
  settingId: string,
  blueprints: ScenarioBlueprint[],
): VisualScenario[] {
  return blueprints.map((blueprint) => ({ ...blueprint, settingId }));
}

const relatedVideos = defineScenarios("hiderelatedvideos", [
  {
    name: "WATCH>related",
    url: TEST_VIDEO_URL,
    target: (page: Page) => {
      return page.locator("#related.style-scope.ytd-watch-flexy");
    },
    setup: async (_page: Page, target: Locator) => {
      await forceStableLayout(target, { width: 50, height: 100 });
    },
  },
]);

const viewCounts = defineScenarios("hideviewcount", [
  {
    name: "WATCH>description",
    url: TEST_VIDEO_URL,
    target: (page: Page) => {
      return page
        .locator("yt-formatted-string#info")
        .filter({ hasText: /view|ago/ })
        .first();
    },
    setup: async (_page: Page, target: Locator) => {
      await forceStableLayout(target, { width: 300, height: 30 });

      const dateElement = target.getByText(/ago/).first();
      await dateElement.evaluate((node) => {
        node.textContent = "20 years ago"; // Arbitrary
      });
    },
  },
  {
    name: "WATCH>related",
    url: TEST_VIDEO_URL,
    target: (page: Page) => {
      return page
        .locator(".yt-content-metadata-view-model__metadata-row")
        .filter({ hasText: /view|ago/ })
        .first();
    },
    setup: async (_page: Page, target: Locator) => {
      await forceStableLayout(target, { width: 300, height: 30 });

      const dateElement = target.getByText(/ago/).first();
      await dateElement.evaluate((node) => {
        node.textContent = "1 month ago"; // Arbitrary
      });
    },
  },
]);

export const SCENARIOS: VisualScenario[] = [...relatedVideos, ...viewCounts];

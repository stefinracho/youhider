import { Locator, Page } from "@playwright/test";
import { defineScenarios, URLS } from "../helpers";
import { forceStableLayout } from "../../utils";

export const relatedVideosScenarios = defineScenarios("hiderelatedvideos", [
  {
    variant: "WATCH>related",
    url: URLS.VIDEO.ME_AT_THE_ZOO,
    snapshotContainer: (page: Page) => {
      return page.locator("#related.style-scope.ytd-watch-flexy");
    },
    prepareElement: async (_page: Page, target: Locator) => {
      await forceStableLayout(target, { width: 50, height: 100 });
    },
  },
]);

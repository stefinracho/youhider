import { Page } from "@playwright/test";
import {
  defineScenarios,
  seedHomeFeed,
  stabilizeMetadata,
  URLS,
} from "../helpers";

export const viewCountsScenarios = defineScenarios("hideviewcount", [
  {
    variant: "HOME>regular videos",
    snapshotContainer: (page: Page) => {
      return page
        .locator(
          "ytd-rich-item-renderer yt-content-metadata-view-model > div:nth-of-type(2)",
        )
        .first();
    },
    beforeTest: seedHomeFeed(),
    prepareElement: stabilizeMetadata(),
  },
  {
    variant: "WATCH>description",
    snapshotContainer: (page: Page) => {
      return page
        .locator("yt-formatted-string#info")
        .filter({ hasText: /view|ago/ })
        .first();
    },
    url: URLS.VIDEO.ME_AT_THE_ZOO,
    prepareElement: stabilizeMetadata(),
  },
  {
    variant: "WATCH>related",
    snapshotContainer: (page: Page) => {
      return page
        .locator(".yt-content-metadata-view-model__metadata-row")
        .filter({ hasText: /view|ago/ })
        .first();
    },
    url: URLS.VIDEO.ME_AT_THE_ZOO,
    prepareElement: stabilizeMetadata(),
  },
]);

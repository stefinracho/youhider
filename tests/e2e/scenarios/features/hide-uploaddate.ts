import { Page } from "@playwright/test";
import { defineScenarios, stabilizeMetadata, URLS } from "../helpers";

export const uploadDateScenarios = defineScenarios("hideuploaddate", [
  {
    variant: "WATCH>description",
    url: URLS.VIDEO.ME_AT_THE_ZOO,
    snapshotContainer: (page: Page) => {
      return page
        .locator("yt-formatted-string#info")
        .filter({ hasText: /view|ago/ })
        .first();
    },
    prepareElement: stabilizeMetadata(),
  },
]);

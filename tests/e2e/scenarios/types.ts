import { Locator, Page } from "@playwright/test";

export type VisualScenario = {
  settingId: string;
  variant: string;
  snapshotContainer: (page: Page) => Locator;
  url?: string;
  beforeTest?: (page: Page) => Promise<void>;
  prepareElement?: (page: Page, target: Locator) => Promise<void>;
};

export type ScenarioBlueprint = Omit<VisualScenario, "settingId">;

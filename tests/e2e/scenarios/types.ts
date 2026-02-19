import { SettingId } from "@/utils/settings";
import { Locator, Page } from "@playwright/test";

export type VisualScenario = {
  settingId: SettingId;
  variant: string;
  url?: string;
  beforeTest?: (page: Page) => Promise<void>;
  snapshotContainer: (page: Page) => Locator;
  prepareElement?: (page: Page, target: Locator) => Promise<void>;
};

export type ScenarioBlueprint = Omit<VisualScenario, "settingId"> & {
  skipOnCI?: boolean;
};

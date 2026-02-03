import { relatedVideosScenarios } from "./features/hide-relatedvideos";
import { uploadDateScenarios } from "./features/hide-uploaddate";
import { viewCountsScenarios } from "./features/hide-viewcount";
import { VisualScenario } from "./types";

export const SCENARIOS: VisualScenario[] = [
  ...relatedVideosScenarios,
  ...uploadDateScenarios,
  ...viewCountsScenarios,
];

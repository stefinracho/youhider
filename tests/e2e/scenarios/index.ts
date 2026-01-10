import { relatedVideosScenarios } from "./features/hide-relatedvideos";
import { viewCountsScenarios } from "./features/hide-viewcount";
import { VisualScenario } from "./types";

export const SCENARIOS: VisualScenario[] = [
  ...relatedVideosScenarios,
  ...viewCountsScenarios,
];

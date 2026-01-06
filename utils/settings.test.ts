import { describe, expect, it } from "vitest";
import { settings, type SettingCategory } from "./settings";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, "../public");

describe("Settings Configuration Integrity", () => {
  it("should match the snapshot", () => {
    expect(settings).toMatchSnapshot();
  });

  describe("Integrity & Uniqueness", () => {
    it("should have unique keys for every setting", () => {
      const keys = settings.map((setting) => setting.key);
      const uniqueKeys = new Set(keys);

      expect(keys.length).toBe(uniqueKeys.size);
    });

    it("should have unique labels and tooltips (prevent copy-paste errors)", () => {
      const labels = new Set(settings.map((setting) => setting.label));
      const tooltips = new Set(settings.map((setting) => setting.tooltip));

      expect(labels.size).toBe(settings.length);
      expect(tooltips.size).toBe(settings.length);
    });
  });

  describe.each(settings)("Setting: $label ($key)", (setting) => {
    it("should have a valid category", () => {
      const validCategories: SettingCategory[] = ["Metrics", "Content"];

      expect(validCategories).toContain(setting.category);
    });

    it("should have valid user-facing text", () => {
      expect(setting.label.trim()).not.toBe("");
      expect(setting.tooltip.trim()).not.toBe("");
    });

    it("should point to a CSS file that actually exists", () => {
      expect(setting.cssFile).toMatch(/^\/css\/[\w-]+\.css$/);

      const relativePath = setting.cssFile.replace(/^\//, "");
      const absolutePath = path.join(PUBLIC_DIR, relativePath);
      const exists = fs.existsSync(absolutePath);

      expect(
        exists,
        `CSS file missing for setting '${setting.key}' at: ${absolutePath}`,
      ).toBe(true);
    });
  });
});

import { Setting } from "@/utils/settings";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createSettingsRow, mountSettings } from "./main";
import { browser } from "wxt/browser";

vi.mock("wxt/browser", () => ({
  browser: {
    storage: {
      local: {
        set: vi.fn(),
        get: vi.fn(),
      },
    },
  },
}));

describe("Popup Logic", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  describe("createSettingsRow", () => {
    const mockSetting: Setting = {
      key: "testKey",
      label: "Test Label",
      tooltip: "Test Tooltip",
      category: "Content",
      cssFile: "/css/hide-viewcount.css",
    };

    it("should create a label with the correct text and tooltip", () => {
      const row = createSettingsRow(mockSetting, false);

      expect(row.tagName).toBe("LABEL");
      expect(row.title).toBe(mockSetting.tooltip);
      expect(row.textContent).toContain(mockSetting.label);
    });

    it("should create a checkbox with the correct initial state", () => {
      const row = createSettingsRow(mockSetting, true);
      const input = row.querySelector("input");

      if (!input) throw new Error("Input not found");

      expect(input.type).toBe("checkbox");
      expect(input.id).toBe(`checkbox-${mockSetting.key}`);
      expect(input.checked).toBe(true);
    });

    it("should call storage.set when clicked", async () => {
      const row = createSettingsRow(mockSetting, false);
      const input = row.querySelector("input");

      document.body.appendChild(row);
      if (!input) throw new Error("Input not found");

      input.click();

      await vi.waitFor(() => {
        expect(input.checked).toBe(true);
        expect(browser.storage.local.set).toHaveBeenCalledWith({
          [mockSetting.key]: true,
        });
      });
    });

    it("should revert the checkbox state if storage.set fails (Optimistic UI rollback)", async () => {
      vi.mocked(browser.storage.local.set).mockRejectedValue(
        new Error("Storage error"),
      );
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const row = createSettingsRow(mockSetting, false);
      const input = row.querySelector("input");

      document.body.appendChild(row);
      if (!input) throw new Error("Input not found");

      expect(input.checked).toBe(false);

      input.click();

      expect(input.checked).toBe(true);

      await vi.waitFor(() => {
        expect(input.checked).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
      });
    });
  });

  describe("mountSettings", () => {
    it("should fetch storage and render fieldsets for categories", async () => {
      const activeKey = settings[0].key;
      const expectedCategories = new Set(
        settings.map((setting) => setting.category),
      );
      vi.mocked(browser.storage.local.get).mockImplementation(async () => ({
        [activeKey]: true,
      }));

      const form = document.createElement("form");
      await mountSettings(form);

      const allKeys = settings.map((setting) => setting.key);
      expect(browser.storage.local.get).toHaveBeenCalledWith(allKeys);

      const fieldsets = form.querySelectorAll("fieldset");
      expect(fieldsets.length).toBe(expectedCategories.size);

      const legendTexts = Array.from(fieldsets).map(
        (fieldset) => fieldset.querySelector("legend")?.textContent,
      );
      expectedCategories.forEach((category) => {
        expect(legendTexts).toContain(category);
      });

      const checkbox = form.querySelector(
        `#checkbox-${activeKey}`,
      ) as HTMLInputElement;
      expect(checkbox).toBeTruthy();
      expect(checkbox.checked).toBe(true);
    });

    it("should handle storage errors gracefully by defaulting to unchecked", async () => {
      vi.mocked(browser.storage.local.get).mockRejectedValue(
        new Error("Storage Fail"),
      );
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const form = document.createElement("form");
      await mountSettings(form);

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));

      const checkboxes = form.querySelectorAll("input[type='checkbox']");
      expect(checkboxes.length).toBe(settings.length);
      checkboxes.forEach((checkbox) => {
        expect((checkbox as HTMLInputElement).checked).toBe(false);
      });
    });
  });
});

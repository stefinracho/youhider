import { Setting } from "@/utils/settings";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createSettingsRow } from "./main";
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

describe("createSettingsRow", () => {
  const mockSetting: Setting = {
    key: "testKey",
    label: "Test Label",
    tooltip: "Test Tooltip",
    category: "Content",
    cssFile: "/css/hide-viewcount.css",
  };

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

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
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
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

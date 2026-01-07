import contentScript from "./content";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "#imports";
import type { ContentScriptContext } from "#imports";

vi.mock("@/utils/settings", () => ({
  settings: [
    { key: "test_key_a", cssFile: "a.css" },
    { key: "test_key_b", cssFile: "b.css" },
  ],
}));

const TEST_KEY = "test_key_a";
const EXPECTED_ATTR = `data-yh-${TEST_KEY}`;
const mockCtx = { isValid: true } as ContentScriptContext;

describe("Content Script Logic", () => {
  beforeEach(() => {
    fakeBrowser.reset();

    const root = document.documentElement;
    root
      .getAttributeNames()
      .filter((attrName) => attrName.startsWith("data-yh"))
      .forEach((attrName) => root.removeAttribute(attrName));

    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should apply attributes based on initial storage", async () => {
      await fakeBrowser.storage.local.set({
        [TEST_KEY]: true,
        test_key_b: false,
      });

      await contentScript.main(mockCtx);

      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(true);
      expect(document.documentElement.getAttribute(EXPECTED_ATTR)).toBe("");
      expect(document.documentElement.hasAttribute("data-yh-test_key_b")).toBe(
        false,
      );
    });

    it("should handle storage retrieval errors gracefully without crashing", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.spyOn(fakeBrowser.storage.local, "get").mockRejectedValue(
        new Error("Storage unavailable"),
      );

      await contentScript.main(mockCtx);

      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("Storage Updates", () => {
    it("should update attributes when storage changes", async () => {
      await contentScript.main(mockCtx);

      await fakeBrowser.storage.local.set({ [TEST_KEY]: true });
      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(true);

      await fakeBrowser.storage.local.set({ [TEST_KEY]: false });
      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(false);
    });

    it("should remove attributes when setting is removed (undefined)", async () => {
      await contentScript.main(mockCtx);

      await fakeBrowser.storage.local.set({ [TEST_KEY]: true });
      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(true);

      await fakeBrowser.storage.local.remove(TEST_KEY);
      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(false);
    });

    it("should ignore changes for keys not in settings", async () => {
      await contentScript.main(mockCtx);

      await fakeBrowser.storage.local.set({ random_junk_key: true });

      expect(
        document.documentElement.hasAttribute("data-yh-random_junk_key"),
      ).toBe(false);
    });

    it("should ignore changes from non-local storage areas", async () => {
      await contentScript.main(mockCtx);

      await fakeBrowser.storage.sync.set({ [TEST_KEY]: true });

      expect(document.documentElement.hasAttribute(EXPECTED_ATTR)).toBe(false);
    });
  });
});

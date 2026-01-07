import { defineContentScript } from "#imports";
import { settings } from "@/utils/settings";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  runAt: "document_start",
  async main() {
    const toggle = (key: string, active: boolean) => {
      document.documentElement.toggleAttribute(`data-yh-${key}`, active);
    };

    const keys = settings.map((setting) => setting.key);
    try {
      const stored = await browser.storage.local.get(keys);

      keys.forEach((key) => {
        if (stored[key]) {
          toggle(key, true);
        }
      });
    } catch (error) {
      console.error(error);
    }

    browser.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;

      Object.entries(changes).forEach(([key, change]) => {
        if (keys.includes(key)) {
          toggle(key, change.newValue === true);
        }
      });
    });
  },
});

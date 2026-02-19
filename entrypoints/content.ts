import { defineContentScript } from "#imports";
import { SettingId, settings } from "@/utils/settings";

export default defineContentScript({
  matches: ["*://*.youtube.com/*"],
  runAt: "document_start",
  async main() {
    const toggle = (key: SettingId, active: boolean) => {
      document.documentElement.toggleAttribute(`data-yh-${key}`, active);
    };

    const keys = settings.map((setting) => setting.key) as SettingId[];
    const keySet = new Set<SettingId>(keys);
    const isSettingId = (key: string): key is SettingId =>
      keySet.has(key as SettingId);

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
        if (isSettingId(key)) {
          toggle(key, change.newValue === true);
        }
      });
    });
  },
});

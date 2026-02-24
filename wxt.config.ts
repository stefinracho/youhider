import { defineConfig } from "wxt";
import packageJson from "./package.json";
import { settings } from "./utils/settings";

const contentScriptsCss = settings.map((setting) => setting.cssFile);

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "YouHider",
    description: "Hide YouTube distractions.",
    version: packageJson.version,
    permissions: ["storage"],
    host_permissions: ["*://*.youtube.com/*"],
    content_scripts: [
      {
        matches: ["*://*.youtube.com/*"],
        css: contentScriptsCss,
        run_at: "document_start",
      },
    ],
    icons: {
      "16": "icon/youhider-16.png",
      "32": "icon/youhider-32.png",
      "48": "icon/youhider-48.png",
      "128": "icon/youhider-128.png",
    },
    action: {
      default_icon: {
        "16": "icon/youhider-16.png",
        "32": "icon/youhider-32.png",
        "48": "icon/youhider-48.png",
        "128": "icon/youhider-128.png",
      },
      default_title: "YouHider",
    },
  },
});

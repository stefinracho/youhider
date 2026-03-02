import { Setting, SettingCategory, settings } from "@/utils/settings";
import { browser } from "wxt/browser";

export function createSettingsRow(
  setting: Setting,
  initialValue: boolean,
): HTMLLabelElement {
  const label = document.createElement("label");
  label.title = setting.tooltip;

  const input = document.createElement("input");
  input.type = "checkbox";
  input.id = `checkbox-${setting.key}`;
  input.checked = initialValue;

  input.addEventListener("change", async () => {
    const desiredState = input.checked;

    try {
      await browser.storage.local.set({ [setting.key]: desiredState });
    } catch (error) {
      console.error(error);
      input.checked = !desiredState;
    }
  });

  label.appendChild(input);
  label.appendChild(document.createTextNode(` ${setting.label}`));

  return label;
}

export async function mountSettings(form: HTMLElement) {
  const keys = settings.map((setting) => setting.key);

  let stored: Record<string, boolean> = {};
  try {
    stored = await browser.storage.local.get(keys);
  } catch (error) {
    console.error(error);
  }

  const categories: Record<SettingCategory, Setting[]> = {
    Content: [],
    Metrics: [],
  };

  settings.forEach((setting) => {
    if (categories[setting.category]) {
      categories[setting.category].push(setting);
    }
  });

  const fragment = document.createDocumentFragment();

  (Object.entries(categories) as [SettingCategory, Setting[]][]).forEach(
    ([catName, catSettings]) => {
      if (catSettings.length === 0) return;

      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.textContent = catName;
      fieldset.appendChild(legend);

      catSettings.forEach((setting) => {
        const isChecked = !!stored[setting.key];
        const row = createSettingsRow(setting, isChecked);
        fieldset.appendChild(row);
      });

      fragment.appendChild(fieldset);
    },
  );

  form.appendChild(fragment);
}

(async () => {
  const form = document.getElementById("settings-form");
  if (form) await mountSettings(form);
})();

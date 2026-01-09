import { Locator } from "@playwright/test";

export async function forceStableLayout(
  locator: Locator,
  size: { width: number; height: number },
) {
  await locator.evaluate((node, size) => {
    const el = node as HTMLElement;

    el.style.setProperty("box-sizing", "border-box", "important");

    el.style.setProperty("width", `${size.width}px`, "important");
    el.style.setProperty("height", `${size.height}px`, "important");
    el.style.setProperty("max-width", `${size.width}px`, "important");
    el.style.setProperty("max-height", `${size.height}px`, "important");

    el.style.setProperty("overflow", "hidden", "important");

    el.style.setProperty("padding", "0", "important");
    el.style.setProperty("margin", "0", "important");
    el.style.setProperty("border", "none", "important");
    el.style.setProperty("outline", "none", "important");

    el.style.setProperty("line-height", `${size.height}px`, "important");
  }, size);
}

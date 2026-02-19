# AGENTS.md - Coding Agent Guidelines for YouHider

## Project Overview

YouHider is a browser extension that hides distracting elements on YouTube. Built with the WXT framework, targeting Chrome and Firefox.

## Build, Lint, and Test Commands

### Development
```bash
npm run dev              # Start dev server for Chrome
npm run dev:firefox      # Start dev server for Firefox
```

### Build
```bash
npm run build            # Production build for Chrome
npm run build:firefox    # Production build for Firefox
npm run zip              # Create zip for Chrome Web Store
npm run zip:firefox      # Create zip for Firefox Add-ons
```

### Type Checking
```bash
npm run compile          # Run TypeScript type checking (tsc --noEmit)
```

### Unit Tests (Vitest)
```bash
npm run test:unit                    # Run all unit tests in watch mode
npx vitest run                       # Run all unit tests once
npx vitest run path/to/test.ts       # Run a single test file
npx vitest run --reporter=verbose    # Run with verbose output
```

### E2E Tests (Playwright)
```bash
npm run test:e2e                     # Run all e2e tests
npx playwright test                  # Run all e2e tests
npx playwright test path/to/spec.ts  # Run a single e2e test file
npx playwright test --headed         # Run with browser visible
npx playwright test --debug          # Run with Playwright Inspector
```

### Run All Tests
```bash
npm run test:all         # Run unit tests then e2e tests
```

## Code Style Guidelines

### Imports

Order imports as follows, separated by blank lines:
1. External libraries (wxt, vitest, playwright)
2. WXT auto-imports (use `#imports`)
3. Local imports using `@/` alias

```typescript
import { defineContentScript } from "#imports";
import { settings } from "@/utils/settings";
import { beforeEach, describe, expect, it, vi } from "vitest";
```

### Path Aliases

- `@/` or `@/*` - Project root
- `~` or `~/*` - Project root
- `#imports` - WXT auto-imports

### TypeScript

- Strict mode is enabled
- Use explicit types for function parameters and return values
- Use `interface` for object shapes, `type` for unions/aliases
- Prefer `as const` for immutable arrays/objects
- Use `type` imports for type-only imports: `import type { X } from "y"`

### Naming Conventions

- **Files**: lowercase with hyphens (e.g., `hide-viewcount.css`, `main.test.ts`)
- **Variables/Functions**: camelCase (e.g., `createSettingsRow`, `toggle`)
- **Types/Interfaces**: PascalCase (e.g., `Setting`, `SettingCategory`)
- **Constants**: camelCase for regular, SCREAMING_SNAKE_CASE for true constants
- **Test files**: `.test.ts` for unit tests, `.spec.ts` for e2e tests
- **CSS data attributes**: prefixed with `data-yh-` (e.g., `data-yh-hideviewcount`)

### Error Handling

Use try/catch with console.error for async operations:

```typescript
try {
  await browser.storage.local.set({ [key]: value });
} catch (error) {
  console.error(error);
}
```

For UI operations, consider rollback on failure:

```typescript
input.addEventListener("change", async () => {
  const desiredState = input.checked;
  try {
    await browser.storage.local.set({ [setting.key]: desiredState });
  } catch (error) {
    console.error(error);
    input.checked = !desiredState;
  }
});
```

### Testing Conventions

#### Unit Tests (Vitest)

- Place test files next to source files with `.test.ts` suffix
- Use `describe`/`it` blocks for organization
- Use `beforeEach`/`afterEach` for setup/teardown
- Mock external dependencies with `vi.mock()`
- Restore mocks with `vi.restoreAllMocks()` in afterEach
- Use `fakeBrowser` from `#imports` for browser API mocking

```typescript
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "#imports";

vi.mock("@/utils/settings", () => ({
  settings: [{ key: "test_key", cssFile: "test.css" }],
}));

describe("Feature", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    vi.restoreAllMocks();
  });

  it("should do something", async () => {
    // test code
  });
});
```

#### E2E Tests (Playwright)

- Place e2e tests in `tests/e2e/`
- Use `.spec.ts` suffix
- Import custom fixtures from `./fixtures`
- Use `test.describe` and `test` from fixtures

```typescript
import { expect, test } from "./fixtures";

test.describe("Feature Name", () => {
  test("should work correctly", async ({ page, context, extensionId }) => {
    // test code
  });
});
```

### CSS Conventions

- CSS files live in `public/css/`
- Use `html[data-yh-{settingkey}]` as the selector prefix
- Use `display: none !important` for hiding elements
- Comment CSS with the element being hidden and notes

```css
html[data-yh-hideviewcount] {
  ytd-video-renderer #metadata-line > span:nth-of-type(1), /* view count */
  ytd-video-renderer #metadata-line > span:nth-of-type(2)::before /* delimiter */ {
    display: none !important;
  }
}
```

### File Structure

```
youhider/
├── entrypoints/          # Extension entry points
│   ├── content.ts        # Content script (runs on YouTube)
│   └── popup/            # Popup UI
│       ├── index.html
│       └── main.ts
├── public/               # Static assets
│   ├── css/              # Feature CSS files
│   └── icon/             # Extension icons
├── tests/
│   ├── *.test.ts         # Unit tests
│   └── e2e/              # E2E tests
│       ├── fixtures.ts   # Playwright fixtures
│       └── *.spec.ts     # E2E test specs
├── utils/                # Shared utilities
│   └── settings.ts       # Setting definitions
├── wxt.config.ts         # WXT configuration
├── vitest.config.ts      # Vitest configuration
├── playwright.config.ts  # Playwright configuration
└── tsconfig.json         # TypeScript configuration
```

### Adding a New Hide Feature

1. Add CSS file in `public/css/hide-{featurename}.css`
2. Add setting entry in `utils/settings.ts`:
   ```typescript
   {
     key: "hide{featurename}",
     label: "Hide {Feature Name}",
     tooltip: "Hides {feature name}.",
     category: "Metrics" | "Content",
     cssFile: "/css/hide-{featurename}.css",
   }
   ```
3. The content script automatically handles storage and attribute toggling

### Pre-commit Checklist

- Run `npm run compile` to check TypeScript
- Run `npx vitest run` to verify unit tests pass
- Run `npm run build` to ensure production build succeeds

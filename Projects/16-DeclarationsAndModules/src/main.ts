import "./globals.js";
import "./darkModePlugin.js";
import { example, showLesson } from "#shared/lessonPage.js";
import lerp, { clamp, stats, VERSION } from "../vendor/legacy-math.js";
import { Direction, isLoud, LogLevel, Theme, themeClass } from "./enums.js";
import { box, Color, format, Validation } from "./merging.js";
import { defaults, readSetting } from "./settings.js";

void showLesson({
  title: "16 · Declarations & Modules",
  intro: "Typing JavaScript with a .d.ts file, enums, namespaces, declaration merging and augmentation.",
  sections: [
    {
      heading: "A hand-written .d.ts for vendor/legacy-math.js",
      note: "The JavaScript file has no types; vendor/legacy-math.d.ts describes it, so these calls are type-checked.",
      examples: [
        example("clamp(15, 0, 10)", () => clamp(15, 0, 10)),
        example("stats([1, 2, 3])", () => stats([1, 2, 3])),
        example("lerp(0, 100, 0.25)  // default export", () => lerp(0, 100, 0.25)),
        example("VERSION", () => VERSION),
      ],
    },
    {
      heading: "Enums vs as const",
      examples: [
        example("Direction.Left", () => Direction.Left),
        example("Direction[2]  // reverse mapping", () => Direction[2]),
        example("isLoud(LogLevel.Error)", () => isLoud(LogLevel.Error)),
        example("themeClass(Theme.Dark)", () => themeClass(Theme.Dark)),
        example('themeClass("light")  // plain strings work with as const', () => themeClass("light")),
      ],
    },
    {
      heading: "Declaration merging and namespaces",
      examples: [
        example("box  // two Box interfaces merged", () => box),
        example("format(3.14159)  // function + namespace", () => format(3.14159)),
        example("format.prefix", () => format.prefix),
        example("Color.named.red.toHex()  // class + namespace", () => Color.named.red.toHex()),
        example('Validation.zipCode.isValid("90210")', () => Validation.zipCode.isValid("90210")),
      ],
    },
    {
      heading: "Module and global augmentation",
      examples: [
        example("defaults  // darkMode added by a plugin module", () => defaults),
        example('readSetting({ language: "fr", darkMode: true }, "darkMode")', () => readSetting({ language: "fr", darkMode: true }, "darkMode")),
        example("[1, 2, 3].lastItem()", () => [1, 2, 3].lastItem()),
        example("globalThis.appVersion", () => globalThis.appVersion),
      ],
    },
  ],
});

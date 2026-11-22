// Run with: npm run build && node 16-DeclarationsAndModules/dist/main.js
import "./globals.js";
import "./darkModePlugin.js";
import lerp, { clamp, stats, VERSION } from "../vendor/legacy-math.js";
import { Direction, LogLevel, Theme, themeClass } from "./enums.js";
import { Color, format, Validation } from "./merging.js";
import { readSetting } from "./settings.js";

console.log(Direction.Left, Direction[2], LogLevel.Info, themeClass(Theme.Dark));
console.log(format(3.14159), Color.named.red.toHex(), Validation.zipCode.isValid("90210"));
console.log(clamp(15, 0, 10), stats([1, 2, 3]), lerp(0, 100, 0.25), VERSION);
console.log([1, 2, 3].lastItem(), globalThis.appVersion);
console.log(readSetting({ language: "fr", darkMode: true }, "darkMode"));

import { test } from "node:test";
import assert from "node:assert/strict";
import "./globals.js";
import "./darkModePlugin.js";
import lerp, { clamp, stats } from "../vendor/legacy-math.js";
import { Direction, isLoud, LogLevel, themeClass } from "./enums.js";
import { box, Color, format, Validation } from "./merging.js";
import { defaults, readSetting, type Settings } from "./settings.js";

test("enums and their alternative", () => {
  assert.equal(Direction.Down, 1);
  assert.equal(Direction[3], "Right");
  assert.equal(isLoud(LogLevel.Error), true);
  // @ts-expect-error string enums do not accept plain strings
  isLoud("error");
  assert.equal(themeClass("light"), "theme-light");
});

test("declaration merging", () => {
  assert.equal(box.width * box.height, 6);
  format.digits = 1;
  assert.equal(format(2.25), "$2.3");
  format.digits = 2;
  assert.equal(new Color(255, 255, 0).toHex(), "#ffff00");
  assert.equal(Color.named.black.toHex(), "#000000");
  assert.equal(Validation.zipCode.isValid("1234"), false);
  assert.equal(Validation.nonEmpty.isValid(" x "), true);
});

test("hand-written .d.ts types a JavaScript module", () => {
  assert.equal(clamp(-5, 0, 10), 0);
  assert.deepEqual(stats([2, 4]), { count: 2, sum: 6, mean: 3 });
  assert.equal(lerp(10, 20, 0.5), 15);
  // @ts-expect-error the declaration says clamp needs three numbers
  clamp("5", 0, 10);
});

test("module augmentation adds darkMode to Settings", () => {
  const settings: Settings = { language: "en", darkMode: true };
  assert.equal(readSetting(settings, "darkMode"), true);
  assert.equal(defaults.darkMode, false);
});

test("global augmentation", () => {
  assert.equal([1, 2, 3].lastItem(), 3);
  assert.equal([].lastItem(), undefined);
  assert.equal(globalThis.appVersion, "16.0.0");
});

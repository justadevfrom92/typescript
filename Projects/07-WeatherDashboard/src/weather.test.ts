import { test } from "node:test";
import assert from "node:assert/strict";
import { cities, forecastUrl, formatTemperature, isForecast, skyFromCode, toDays } from "./weather.js";

const sample = {
  current: { time: "2026-01-01T12:00", temperature_2m: 10, weather_code: 3, wind_speed_10m: 12.4 },
  daily: {
    time: ["2026-01-01", "2026-01-02"],
    weather_code: [0, 61],
    temperature_2m_max: [12, 9],
    temperature_2m_min: [4],
  },
};

test("guard accepts real-shaped data and rejects malformed data", () => {
  assert.equal(isForecast(sample), true);
  assert.equal(isForecast({ current: {} }), false);
  assert.equal(isForecast(null), false);
});

test("toDays skips incomplete rows", () => {
  assert.deepEqual(toDays(sample.daily), [{ date: "2026-01-01", sky: "clear", max: 12, min: 4 }]);
});

test("skyFromCode groups WMO codes", () => {
  assert.equal(skyFromCode(0), "clear");
  assert.equal(skyFromCode(45), "fog");
  assert.equal(skyFromCode(81), "rain");
  assert.equal(skyFromCode(73), "snow");
  assert.equal(skyFromCode(95), "storm");
});

test("formatTemperature converts units", () => {
  assert.equal(formatTemperature(100, "F"), "212°F");
  assert.equal(formatTemperature(-0.4, "C"), "0°C");
});

test("forecastUrl targets open-meteo", () => {
  assert.match(forecastUrl(cities[0]!), /^https:\/\/api\.open-meteo\.com\/v1\/forecast\?latitude=51\.51/);
});

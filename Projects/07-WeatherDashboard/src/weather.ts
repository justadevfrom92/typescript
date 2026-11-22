// Weather data shapes, a runtime guard, and pure helpers (no DOM, unit tested).
import { hasShape, isArrayOf, isNumber, isRecord, isString } from "#shared/guards.js";

export type City = { name: string; latitude: number; longitude: number };

export const cities: readonly City[] = [
  { name: "London", latitude: 51.51, longitude: -0.13 },
  { name: "New York", latitude: 40.71, longitude: -74.01 },
  { name: "Tokyo", latitude: 35.68, longitude: 139.69 },
  { name: "Nairobi", latitude: -1.29, longitude: 36.82 },
  { name: "Sydney", latitude: -33.87, longitude: 151.21 },
];

export type Forecast = {
  current: { time: string; temperature_2m: number; weather_code: number; wind_speed_10m: number };
  daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] };
};

const isNumberList = isArrayOf(isNumber);

export const isForecast = hasShape<Forecast>({
  current: hasShape<Forecast["current"]>({
    time: isString,
    temperature_2m: isNumber,
    weather_code: isNumber,
    wind_speed_10m: isNumber,
  }),
  daily: (value): value is Forecast["daily"] =>
    isRecord(value) &&
    isArrayOf(isString)(value["time"]) &&
    isNumberList(value["weather_code"]) &&
    isNumberList(value["temperature_2m_max"]) &&
    isNumberList(value["temperature_2m_min"]),
});

export function forecastUrl(city: City): string {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "5",
  });
  return `https://api.open-meteo.com/v1/forecast?${params}`;
}

export type Sky = "clear" | "cloudy" | "fog" | "rain" | "snow" | "storm";

// WMO weather codes grouped into a small union.
export function skyFromCode(code: number): Sky {
  if (code <= 1) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 48) return "fog";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code <= 77 || code === 85 || code === 86) return "snow";
  return "storm";
}

export const skyLabels: Record<Sky, { icon: string; label: string }> = {
  clear: { icon: "☀️", label: "Clear" },
  cloudy: { icon: "⛅", label: "Cloudy" },
  fog: { icon: "🌫️", label: "Fog" },
  rain: { icon: "🌧️", label: "Rain" },
  snow: { icon: "❄️", label: "Snow" },
  storm: { icon: "⛈️", label: "Storm" },
};

export type Unit = "C" | "F";

export function formatTemperature(celsius: number, unit: Unit): string {
  const value = unit === "C" ? celsius : (celsius * 9) / 5 + 32;
  return `${Math.round(value)}°${unit}`;
}

export type DayForecast = { date: string; sky: Sky; max: number; min: number };

/** Zips the parallel daily arrays into one object per day, skipping incomplete rows. */
export function toDays(daily: Forecast["daily"]): DayForecast[] {
  return daily.time.flatMap((date, i) => {
    const code = daily.weather_code[i];
    const max = daily.temperature_2m_max[i];
    const min = daily.temperature_2m_min[i];
    return code === undefined || max === undefined || min === undefined ? [] : [{ date, sky: skyFromCode(code), max, min }];
  });
}

export function weekday(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", { weekday: "short" });
}

import { useEffect, useState } from "#shared/dom.js";
import { fetchJson } from "#shared/http.js";
import { loadJson, saveJson } from "#shared/storage.js";
import { cities, forecastUrl, formatTemperature, isForecast, skyFromCode, skyLabels, toDays, weekday, type City, type Forecast, type Unit } from "./weather.js";

type State = { status: "loading" } | { status: "error"; error: string } | { status: "ready"; forecast: Forecast };

const isUnit = (value: unknown): value is Unit => value === "C" || value === "F";

export function App(): Node {
  const [city, setCity] = useState<City>(cities[0]!);
  const [unit, setUnit] = useState<Unit>(() => loadJson("weather-unit", isUnit, "C"));
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading" });
    fetchJson(forecastUrl(city), isForecast, { signal: controller.signal }).then((result) => {
      if (controller.signal.aborted) return;
      setState(result.ok ? { status: "ready", forecast: result.data } : { status: "error", error: result.error });
    });
    return () => controller.abort(); // Switching city quickly cancels the old request.
  }, [city, attempt]);

  const changeUnit = (next: Unit) => {
    setUnit(next);
    saveJson("weather-unit", next);
  };

  return (
    <div>
      <header className="header">
        <h1>Weather Dashboard</h1>
        <p className="muted">Live forecast from api.open-meteo.com, rendered with a hand-made JSX runtime.</p>
      </header>

      <div className="row" style={{ justifyContent: "space-between", marginBottom: "16px" }}>
        <div className="row" role="group" aria-label="City">
          {cities.map((option) => (
            <button type="button" aria-pressed={String(option.name === city.name)} onClick={() => setCity(option)}>
              {option.name}
            </button>
          ))}
        </div>
        <div className="row" role="group" aria-label="Unit">
          {(["C", "F"] as const).map((option) => (
            <button type="button" aria-pressed={String(option === unit)} onClick={() => changeUnit(option)}>
              °{option}
            </button>
          ))}
        </div>
      </div>

      <WeatherView state={state} unit={unit} cityName={city.name} onRetry={() => setAttempt((n) => n + 1)} />
    </div>
  );
}

type ViewProps = { state: State; unit: Unit; cityName: string; onRetry: () => void };

function WeatherView({ state, unit, cityName, onRetry }: ViewProps): Node {
  switch (state.status) {
    case "loading":
      return <p className="muted" role="status">Loading forecast for {cityName}…</p>;
    case "error":
      return (
        <p className="notice" role="alert">
          Could not load the forecast. {state.error}
          <button type="button" onClick={onRetry}>Retry</button>
        </p>
      );
    case "ready": {
      const { current, daily } = state.forecast;
      const sky = skyLabels[skyFromCode(current.weather_code)];
      return (
        <div className="stack">
          <section className="card">
            <h2>{cityName} now</h2>
            <p style={{ fontSize: "2.5rem", margin: "0" }}>
              {sky.icon} {formatTemperature(current.temperature_2m, unit)}
            </p>
            <p className="muted">
              {sky.label} · wind {Math.round(current.wind_speed_10m)} km/h
            </p>
          </section>
          <section className="grid">
            {toDays(daily).map((day) => (
              <article className="card" key={day.date}>
                <h2>{weekday(day.date)}</h2>
                <p style={{ fontSize: "1.8rem", margin: "0" }}>{skyLabels[day.sky].icon}</p>
                <p>
                  {formatTemperature(day.max, unit)} <span className="muted">/ {formatTemperature(day.min, unit)}</span>
                </p>
              </article>
            ))}
          </section>
        </div>
      );
    }
  }
}

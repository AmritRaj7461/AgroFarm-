import React, { useState } from 'react';
import { useTranslation } from "react-i18next";

export default function WeatherAlertsPage() {
  const [locationLabel, setLocationLabel] = useState('Not detected');
  const [coords, setCoords] = useState(null); // { lat, lon }
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqi, setAqi] = useState(null); // derived for now
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { t } = useTranslation();


  // Small helper: map condition to icon
  const getConditionIcon = (conditionText = '') => {
    const c = conditionText.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return '🌧️';
    if (c.includes('storm') || c.includes('thunder')) return '⛈️';
    if (c.includes('cloud')) return '⛅';
    if (c.includes('mist') || c.includes('fog') || c.includes('haze')) return '🌫️';
    if (c.includes('snow')) return '❄️';
    return '☀️';
  };

  // Build a tiny 3-day “pseudo” forecast from current data
  const buildForecastFromCurrent = (w) => {
    if (!w) return [];

    const baseTemp = Number(w.temperature) || 28;
    const baseRain = Number(w.precipitation) || 0;
    const condition = w.description || w.condition || 'Clear sky';
    const icon = getConditionIcon(condition);

    return [
      {
        day: 'Today',
        temp: `${Math.round(baseTemp)}°C`,
        rain: `${Math.min(80, Math.round(baseRain * 15))}%`,
        condition,
        icon,
      },
      {
        day: 'Tomorrow',
        temp: `${Math.round(baseTemp + 1)}°C`,
        rain: `${Math.max(10, Math.round(baseRain * 10))}%`,
        condition:
          baseRain > 0
            ? 'Light showers possible'
            : baseTemp > 32
              ? 'Hot and dry'
              : 'Partly cloudy',
        icon: baseRain > 0 ? '🌦️' : baseTemp > 32 ? '☀️' : '⛅',
      },
      {
        day: 'Day 3',
        temp: `${Math.round(baseTemp - 1)}°C`,
        rain: `${Math.round(Math.max(5, baseRain * 5))}%`,
        condition:
          baseRain > 5
            ? 'Watch for waterlogging'
            : baseTemp < 20
              ? 'Cool and pleasant'
              : 'Stable conditions',
        icon: baseRain > 5 ? '🌧️' : '🌤️',
      },
    ];
  };

  // Simple derived “field air quality / comfort index”
  const deriveAqi = (w) => {
    if (!w) return null;
    const temp = Number(w.temperature) || 28;
    const humidity = Number(w.humidity) || 60;
    // Just a rough score for demo, 0–200
    let score = 120;
    if (humidity > 80) score += 20;
    if (humidity < 40) score += 10;
    if (temp > 35) score += 30;
    if (temp < 15) score += 10;
    return Math.min(200, Math.max(30, Math.round(score)));
  };

  const getAqiLevel = (value) => {
    if (value == null) return '—';
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 150) return 'Unhealthy for sensitive groups';
    if (value <= 200) return 'Unhealthy';
    return 'Very unhealthy';
  };

  const buildWeatherTips = (w) => {
    if (!w) {
      return [
        'Sync with your device or set a location to view weather-based farm tips.',
      ];
    }

    const tips = [];
    const temp = Number(w.temperature) || 28;
    const rain = Number(w.precipitation) || 0;
    const humidity = Number(w.humidity) || 60;

    if (rain === 0) {
      tips.push('No rainfall detected. Plan irrigation according to crop water needs.');
    } else if (rain > 10) {
      tips.push(
        'High rainfall detected. Check fields for waterlogging and clear drainage channels.'
      );
    } else {
      tips.push('Light rainfall possible. You can slightly reduce irrigation for today.');
    }

    if (temp >= 35) {
      tips.push(
        'Very warm conditions. Prefer evening or early morning irrigation to reduce evaporation.'
      );
    } else if (temp <= 18) {
      tips.push('Cool weather. Seed germination may be slower—choose varieties accordingly.');
    } else {
      tips.push('Temperature is suitable for most crops with normal management.');
    }

    if (humidity >= 80) {
      tips.push(
        'High humidity can increase fungal diseases. Avoid overhead irrigation late in the day.'
      );
    } else if (humidity <= 40) {
      tips.push(
        'Low humidity and heat together can stress young plants. Consider mulching to retain moisture.'
      );
    }

    tips.push(
      'Store fertilizers, seeds and chemicals in a dry, shaded place to avoid clumping and spoilage.'
    );

    return tips;
  };

  const [tips, setTips] = useState(buildWeatherTips(null));

  // Fetch weather via backend for given coordinates
  const fetchWeatherForCoords = async (lat, lon, label) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`
      );
      if (!res.ok) {
        throw new Error('Backend error while fetching weather');
      }
      const data = await res.json();

      setCoords({ lat, lon });
      setLocationLabel(label || `${lat.toFixed(3)}, ${lon.toFixed(3)}`);
      setWeather(data);

      const derivedForecast = buildForecastFromCurrent(data);
      setForecast(derivedForecast);

      const derivedAqi = deriveAqi(data);
      setAqi(derivedAqi);
      setTips(buildWeatherTips(data));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data for this location.');
    } finally {
      setLoading(false);
    }
  };

  // Button: Sync with device (geolocation)
  const handleSyncWithDevice = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        fetchWeatherForCoords(lat, lon, 'My current location');
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setError('Location access denied. Please allow location or use manual input.');
      }
    );
  };

  // Button: Change location (manual lat, lon)
  const handleChangeLocation = () => {
    const input = window.prompt(
      "Enter location as 'lat, lon' (for example: 26.122, 85.390 for Muzaffarpur):"
    );
    if (!input) return;

    const parts = input.split(',');
    if (parts.length !== 2) {
      setError('Please enter valid coordinates in the format: lat, lon');
      return;
    }

    const lat = parseFloat(parts[0].trim());
    const lon = parseFloat(parts[1].trim());
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setError('Invalid latitude or longitude values.');
      return;
    }

    fetchWeatherForCoords(lat, lon);
  };

  const aqiLevel = getAqiLevel(aqi);
  const todayCondition =
    weather?.description || weather?.condition || 'Clear sky';

  return (
    <section className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto bg-transparent">
      {/* Top location + controls */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("weatherPage.locationTag")}
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            {t("weatherPage.weatherAlertsTitle")} •{" "}
            {locationLabel === "Not detected"
              ? t("weatherPage.selectLocation")
              : locationLabel}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("weatherPage.locationSubtitle")}
          </p>

          {error && (
            <p className="mt-1 text-xs text-red-500">{error}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleChangeLocation}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:cursor-pointer"
          >
            {t("weatherPage.changeLocation")}
          </button>

          <button
            onClick={handleSyncWithDevice}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white disabled:opacity-60 hover:cursor-pointer"
            disabled={loading}
          >
            {loading
              ? t("weatherPage.syncing")
              : t("weatherPage.syncWithDevice")}
          </button>
        </div>
      </div>

      {/* Today + 3-day forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("weatherPage.today")}
              </p>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {t("weatherPage.conditions")}
              </h3>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {weather ? `${Math.round(weather.temperature)}°C` : "—"}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {weather
                  ? t("weatherPage.maxMin", {
                    max: weather.maxTemp,
                    min: weather.minTemp,
                  })
                  : t("weatherPage.waitingForData")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-3xl">
              {weather ? getConditionIcon(todayCondition) : "☁️"}
            </div>

            <div className="space-y-1 text-xs text-slate-700 dark:text-slate-200">
              <p>
                {t("weatherPage.conditionLabel")}{" "}
                <span className="font-medium">{todayCondition}</span>
              </p>

              <p>
                {t("weatherPage.humidityLabel")}{" "}
                <span className="font-medium">
                  {weather ? `${weather.humidity}%` : "—"}
                </span>
              </p>

              <p>
                {t("weatherPage.rainfallLabel")}{" "}
                <span className="font-medium">
                  {weather ? `${weather.precipitation} mm` : "—"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 3-day forecast */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm space-y-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("weatherPage.next3Days")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forecast.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("weatherPage.syncLocationToSeePattern")}
              </p>
            ) : (
              forecast.map((f) => (
                <div
                  key={f.day}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 flex flex-col items-center gap-1"
                >
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {f.day}
                  </p>

                  <div className="text-2xl">{f.icon}</div>

                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {f.temp}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {f.condition}
                  </p>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t("weatherPage.rainChance")}: {f.rain}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AQI + tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Comfort index */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {t("weatherPage.comfortIndexTitle")}
          </p>

          <p className="text-2xl font-bold text-amber-600">{aqi ?? "—"}</p>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t("weatherPage.comfortLevel")} {aqiLevel}
          </p>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t("weatherPage.comfortDescription")}
          </p>
        </div>

        {/* Safety tips */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-sm space-y-2">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {t("weatherPage.safetyTipsTitle")}
          </p>

          <ul className="text-xs list-disc pl-4 space-y-1 text-slate-700 dark:text-slate-200">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>

  );
}

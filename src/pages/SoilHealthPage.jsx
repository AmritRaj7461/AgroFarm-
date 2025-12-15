import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function SoilHealthPage() {
  const { t } = useTranslation();

  const [locationLabel, setLocationLabel] = useState("Not detected");
  const [coords, setCoords] = useState(null);
  const [weather, setWeather] = useState(null);
  const [soil, setSoil] = useState({
    region: "",
    soilType: "",
    phRange: "",
    organicCarbon: "",
  });
  const [crops, setCrops] = useState([]);
  const [hasDetected, setHasDetected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("soilHealthSnapshot");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setLocationLabel(parsed.locationLabel);
      setCoords(parsed.coords);
      setWeather(parsed.weather);
      setSoil(parsed.soil);
      setCrops(parsed.crops || []);
      setHasDetected(true);
    } catch { }
  }, []);
  const getLocationName = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await res.json();
    const address = data.address || {};

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.suburb ||
      address.municipality ||
      address.county;

    const state = address.state;
    const country = address.country;

    // Build readable location with commas
    return [city, state, country].filter(Boolean).join(", ");
  } catch (error) {
    return "Unknown location";
  }
};


  const handleDetect = () => {
    if (!navigator.geolocation) return;
    setLoading(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      setCoords({ lat, lon });

      const locationName = await getLocationName(lat, lon);
      setLocationLabel(locationName);


      const weatherData = await fetch(
        `http://localhost:5000/api/weather?lat=${lat}&lon=${lon}`
      ).then((r) => r.json());

      const soilData = await fetch(
        `http://localhost:5000/api/soil?lat=${lat}&lon=${lon}`
      ).then((r) => r.json());

      const cropData = await fetch(
        `http://localhost:5000/api/recommendations?soilType=${soilData.soilType}`
      ).then((r) => r.json());

      const weatherState = {
        temperature: weatherData.temperature,
        humidity: weatherData.humidity,
        maxTemp: weatherData.maxTemp,
        minTemp: weatherData.minTemp,
        precipitation: weatherData.precipitation,
        description: weatherData.description,
      };

      setWeather(weatherState);
      setSoil(soilData);
      setCrops(cropData.crops || []);
      setHasDetected(true);

      sessionStorage.setItem(
        "soilHealthSnapshot",
        JSON.stringify({
          locationLabel: locationName,
          coords: { lat, lon },
          weather: weatherState,
          soil: soilData,
          crops: cropData.crops || [],
        })
      );

      setLoading(false);
    });
  };

  const mapUrl =
    coords &&
    `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.05
    },${coords.lat - 0.05},${coords.lon + 0.05},${coords.lat + 0.05
    }&layer=mapnik&marker=${coords.lat},${coords.lon}`;

  const card =
    "rounded-2xl bg-white/5 backdrop-blur border border-white/10 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/10";

  return (
    <section className="flex-1 p-6 space-y-6 text-slate-100 animate-fadeIn">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-emerald-400">
            Soil & Climate Insight
          </p>
          <h2 className="text-2xl font-semibold mt-1">
            Understand your soil and weather
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Detect your location to get live weather, soil profile and crop
            planning insights.
          </p>
        </div>

        <button
          onClick={handleDetect}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 transition text-sm font-medium shadow-lg hover:cursor-pointer"
        >
          📍 {loading ? "Detecting..." : "Detect from my location"}
        </button>
      </div>

      <p className="text-xs text-slate-400">
        Current location:{" "}
        <span className="text-slate-100 font-medium">{locationLabel}</span>
      </p>

      {hasDetected && weather && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

          {/* LEFT CONTENT */}
          <div className="xl:col-span-2 space-y-6">

            {/* WEATHER */}
            <div className={`${card} p-6`}>
              <h3 className="font-semibold mb-4">🌤 Local Weather Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">Temperature</p>
                  <p className="text-xl font-semibold">
                    {weather.temperature}°C
                  </p>
                  <p className="text-xs text-slate-400">
                    Max {weather.maxTemp}° / Min {weather.minTemp}°
                  </p>
                </div>

                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">Humidity</p>
                  <p className="text-xl font-semibold">
                    {weather.humidity}%
                  </p>
                </div>

                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">Rainfall</p>
                  <p className="text-xl font-semibold">
                    {weather.precipitation} mm
                  </p>
                </div>
              </div>
            </div>

            {/* SOIL */}
            <div className={`${card} p-6`}>
              <h3 className="font-semibold mb-4">🌱 Soil Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">Soil Type</p>
                  <p className="font-semibold">{soil.soilType}</p>
                </div>
                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">pH Range</p>
                  <p className="font-semibold">{soil.phRange}</p>
                </div>
                <div className={card + " p-4"}>
                  <p className="text-xs text-slate-400">Organic Carbon</p>
                  <p className="font-semibold">{soil.organicCarbon}</p>
                </div>
              </div>
            </div>

            {/* CROPS */}
            {crops.length > 0 && (
              <div className={`${card} p-6`}>
                <h3 className="font-semibold mb-4">🌾 Crop Planning Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {crops.map((crop) => (
                    <div key={crop.name} className={card + " p-4"}>
                      <div className="flex justify-between mb-1">
                        <p className="font-semibold">{crop.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                          {crop.idealSeason}
                        </span>
                      </div>
                      <p className="text-xs">Sowing: {crop.sowing}</p>
                      <p className="text-xs">Growing: {crop.growing}</p>
                      <p className="text-xs">Harvest: {crop.harvest}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAP */}
          <div className={`${card} p-4 hover:shadow-emerald-500/20`}>
            <h3 className="font-semibold mb-3">📍 Live Map</h3>
            <div className="h-56 md:h-60 rounded-xl overflow-hidden border border-white/10">
              <iframe
                src={mapUrl}
                className="w-full h-full"
                loading="lazy"
                title="Map"
              />
            </div>
          </div>

        </div>
      )}
    </section>
  );
}

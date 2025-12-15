import axios from "axios";

export const getWeather = async (req, res) => {
  const { lat, lon } = req.query;

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation,relative_humidity_2m`;

    const { data } = await axios.get(url);

    // Extract summary
    const summary = {
      temperature: data.hourly.temperature_2m[0],
      humidity: data.hourly.relative_humidity_2m[0],
      precipitation: data.hourly.precipitation[0],
      maxTemp: Math.max(...data.hourly.temperature_2m.slice(0, 24)),
      minTemp: Math.min(...data.hourly.temperature_2m.slice(0, 24)),
    };

    res.json(summary);
  } catch (error) {
    console.error("Weather API error:", error.message);
    res.status(500).json({ error: "Weather API failed" });
  }
};

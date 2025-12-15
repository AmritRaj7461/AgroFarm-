// index.js

const fetch = require("node-fetch");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// ✅ NEW: load environment variables
require('dotenv').config();


// ✅ NEW: axios for calling external weather API
const axios = require('axios');

const connectToMongoDB = require('./db/connectDB');
const authRoutes = require('./routes/auth.route');
const userRoutes = require("./routes/user.route");


const Scheme = require('./models/Scheme');
const Method = require('./models/Method');

const app = express();

// Parse cookies
app.use(cookieParser());

// CORS setup (for Vite frontend at http://localhost:5173)
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON bodies
app.use(express.json());

// ---------- Auth routes ----------
app.use('/api/auth', authRoutes);

// ---------- Get User Info ------------
app.use("/api/users", userRoutes);

// ---------- Sustainable methods routes ----------
app.get('/api/methods', async (req, res) => {
  try {
    const methods = await Method.find().lean();
    res.status(200).json(methods);
  } catch (err) {
    console.error('Error fetching methods from DB:', err);
    res
      .status(500)
      .json({ message: 'Server error while fetching methods' });
  }
});

// ---------- Schemes routes ----------
app.get('/api/schemes', async (req, res) => {
  try {
    const schemes = await Scheme.find().lean();
    res.status(200).json(schemes);
  } catch (err) {
    console.error('Error fetching schemes from DB:', err);
    res
      .status(500)
      .json({ message: 'Server error while fetching schemes' });
  }
});

// Optional: add new scheme (for admin / viva)
app.post('/api/schemes', async (req, res) => {
  try {
    const body = req.body;
    const scheme = new Scheme(body);
    const saved = await scheme.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating scheme:', err);
    res
      .status(400)
      .json({ message: 'Error creating scheme', error: err.message });
  }
});


// ===================================================================
// ✅ NEW: WEATHER + SOIL + CROP RECOMMENDATION INTEGRATION
// ===================================================================

// --- Weather & Soil: DATASETS (simple mock zones + crops) --- //

const soilZones = [
  {
    name: 'North India - Alluvial',
    latMin: 20,
    latMax: 32,
    lonMin: 73,
    lonMax: 90,
    soilType: 'Alluvial',
    phRange: '6.5 - 7.5',
    organicCarbon: 'Medium',
  },
  {
    name: 'Peninsular - Red/Loamy',
    latMin: 10,
    latMax: 20,
    lonMin: 73,
    lonMax: 85,
    soilType: 'Red & Loamy',
    phRange: '6.0 - 7.0',
    organicCarbon: 'Low-Medium',
  },
  {
    name: 'Generic Zone',
    latMin: -90,
    latMax: 90,
    lonMin: -180,
    lonMax: 180,
    soilType: 'Mixed',
    phRange: '6.0 - 7.5',
    organicCarbon: 'Medium',
  },
];

const cropRecommendations = {
  'Alluvial': [
    {
      name: 'Wheat',
      idealSeason: 'Rabi',
      sowing: 'Nov–Dec',
      growing: 'Dec–Feb',
      harvest: 'Mar–Apr',
    },
    {
      name: 'Paddy',
      idealSeason: 'Kharif',
      sowing: 'Jun–Jul',
      growing: 'Jul–Sep',
      harvest: 'Oct–Nov',
    },
    {
      name: 'Sugarcane',
      idealSeason: 'Perennial',
      sowing: 'Feb–Apr',
      growing: 'Year-round',
      harvest: '12–16 months after sowing',
    },
  ],
  'Red & Loamy': [
    {
      name: 'Groundnut',
      idealSeason: 'Kharif',
      sowing: 'Jun–Jul',
      growing: 'Jul–Sep',
      harvest: 'Oct–Nov',
    },
    {
      name: 'Millets (Bajra)',
      idealSeason: 'Kharif',
      sowing: 'Jun–Jul',
      growing: 'Jul–Sep',
      harvest: 'Sep–Oct',
    },
  ],
  'Mixed': [
    {
      name: 'Pulses (Gram)',
      idealSeason: 'Rabi',
      sowing: 'Oct–Nov',
      growing: 'Nov–Feb',
      harvest: 'Feb–Mar',
    },
  ],
};

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;


// --- Weather & Soil: ROUTES --- //

// GET /api/weather?lat=..&lon=..
// ⬇️ ADD / UPDATE THIS PART ONLY, leave your existing auth/method/scheme routes as they are
app.get("/api/weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "lat and lon are required" });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(weatherUrl);
    const data = await response.json();

    // 🔍 DEBUG LOG
    console.log("Weather API status:", response.status);
    console.log("Weather API raw data:", data);

    if (!response.ok) {
      // Send error back so frontend can show a proper message
      return res.status(response.status).json({
        message: "Weather API error",
        details: data,
      });
    }

    // Normal success payload
    return res.json({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      maxTemp: data.main.temp_max,
      minTemp: data.main.temp_min,
      precipitation: data.rain?.["1h"] || 0,
      description: data.weather?.[0]?.description || "No description",
      locationName: `${data.name || "Unknown"}, ${data.sys?.country || ""}`,
    });
  } catch (err) {
    console.error("Server error in /api/weather:", err);
    return res.status(500).json({ message: "Server error while fetching weather" });
  }
});

// GET /api/soil?lat=..&lon=..
app.get('/api/soil', (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon are required' });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  const zone =
    soilZones.find(
      (z) =>
        latitude >= z.latMin &&
        latitude <= z.latMax &&
        longitude >= z.lonMin &&
        longitude <= z.lonMax
    ) || soilZones[soilZones.length - 1];

  res.json({
    region: zone.name,
    soilType: zone.soilType,
    phRange: zone.phRange,
    organicCarbon: zone.organicCarbon,
  });
});

// GET /api/recommendations?soilType=Alluvial
app.get('/api/recommendations', (req, res) => {
  const { soilType } = req.query;
  if (!soilType) {
    return res.status(400).json({ error: 'soilType is required' });
  }

  const recs = cropRecommendations[soilType] || cropRecommendations['Mixed'];

  res.json({
    soilType,
    crops: recs,
  });
});

// ===================================================================
// ✅ END of new Weather + Soil + Crop APIs
// ===================================================================
// ---------- Soil + Weather Intelligence ----------
app.get("/api/soil-weather", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    // -------- 1️⃣ WEATHER DATA --------
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    const weather = await weatherRes.json();

    if (weather.cod !== 200) {
      return res.status(500).json({ message: "Weather API failed" });
    }

    const temperature = weather.main.temp;
    const humidity = weather.main.humidity;
    const rainfall = weather.rain?.["1h"] || 0;

    // -------- 2️⃣ SOIL FALLBACK (SAFE & RELIABLE) --------
    let soilType = "Loamy";
    let soilPH = 6.7;

    // Simple India-based logic (production fallback)
    if (lat > 25 && lon < 80) soilType = "Alluvial";
    else if (lat < 20) soilType = "Red Soil";
    else if (lon > 85) soilType = "Laterite";

    // -------- 3️⃣ CROP CATEGORY LOGIC --------
    let cropCategory = "Rabi";

    if (temperature > 25 && rainfall > 20) cropCategory = "Kharif";
    else if (temperature > 30) cropCategory = "Zaid";

    res.json({
      location: weather.name,
      weather: {
        temperature,
        humidity,
        rainfall,
      },
      soil: {
        type: soilType,
        ph: soilPH,
      },
      recommendation: {
        cropCategory,
        confidence: "High",
      },
    });
  } catch (err) {
    console.error("Soil-weather error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// ---------- Connect DB and start server ----------
connectToMongoDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

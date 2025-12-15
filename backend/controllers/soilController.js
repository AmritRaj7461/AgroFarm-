import axios from "axios";

export const getSoil = async (req, res) => {
  const { lat, lon } = req.query;

  // create bounding box around user's location
  const delta = 0.05;
  const bbox = `${lat - delta},${lon - delta},${lat + delta},${lon + delta}`;

  const url = `https://bhuvan-app3.nrsc.gov.in/bhuvan/wms?
    SERVICE=WMS&
    VERSION=1.1.1&
    REQUEST=GetFeatureInfo&
    LAYERS=soildata:soilmap&
    QUERY_LAYERS=soildata:soilmap&
    INFO_FORMAT=application/json&
    SRS=EPSG:4326&
    BBOX=${bbox}&
    HEIGHT=512&
    WIDTH=512&
    X=256&
    Y=256`.replace(/\s+/g, "");

  try {
    const { data } = await axios.get(url);

    const soil = data?.features?.[0]?.properties || {};

    res.json({
      soilType: soil.soil_type || "Unknown",
      texture: soil.texture || "Unknown",
      ph: soil.ph || "Unavailable",
    });
  } catch (error) {
    console.log("Soil API error:", error.message);
    res.status(500).json({ error: "Soil API failed" });
  }
};

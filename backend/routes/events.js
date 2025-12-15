// routes/events.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: "e1",
      title: "Soil Health Camp - Block A",
      date: "2025-12-10",
      location: "KVK Center",
    },
    {
      id: "e2",
      title: "Micro-Irrigation Demo",
      date: "2025-12-12",
      location: "Gram Panchayat Field",
    },
  ]);
});

export default router;

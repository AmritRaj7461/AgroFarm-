const mongoose = require('mongoose');

const usageTrendSchema = new mongoose.Schema(
  {
    label: String, // e.g. "2010"
    value: Number, // e.g. 15
  },
  { _id: false }
);

const methodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    shortLabel: String,
    badge: String,
    description: String,
    benefits: [String],
    practices: [String],
    usageTrend: [usageTrendSchema],
    highlight: String,
    videoUrl: String,
  },
  {
    collection: 'methods',
  }
);

module.exports = mongoose.model('Method', methodSchema);

const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tagline: String,
    shortNote: String,
    focusAreas: [String],
    eligibility: String,
    support: String,
    howItHelps: String,
    learnMoreUrl: String,
    imageUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
  },
  {
    collection: 'schemes',
  }
);

module.exports = mongoose.model('Scheme', schemeSchema);

const mongoose = require('mongoose');

const PricingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tokens: { type: Number, required: true },
  priceBirr: { type: Number, required: true },
  perks: { type: [String], default: [] },
  sortOrder: { type: Number, default: Date.now },
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('PricingPlan', PricingPlanSchema);

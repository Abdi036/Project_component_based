const mongoose = require('mongoose');

const DiscountCampaignSchema = new mongoose.Schema({
  code: { type: String, required: true, uppercase: true },
  percentage: { type: Number, required: true, min: 1, max: 100 },
  firstPurchaseOnly: { type: Boolean, default: false },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  redemptions: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DiscountCampaign', DiscountCampaignSchema);

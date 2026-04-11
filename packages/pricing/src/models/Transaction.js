const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'PricingPlan', required: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'DiscountCampaign' },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  amountBirr: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

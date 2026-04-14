import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  pricingPlan: {
    type: mongoose.Schema.ObjectId,
    ref: "PricingPlan",
    required: true,
  },
  tierId: {
    type: String,
    required: true,
  },
  tokens: {
    type: Number,
    required: true,
  },
  originalAmountBirr: {
    type: Number,
    required: true,
  },
  amountBirr: {
    type: Number,
    required: true,
  },
  campaignCode: {
    type: String,
    default: null,
  },
  discountPercentage: {
    type: Number,
    default: 0,
  },
  firstPurchaseOnlyApplied: {
    type: Boolean,
    default: false,
  },
  merchantOrderId: {
    type: String,
    required: true,
    unique: true,
  },
  txRef: {
    type: String,
    default: null,
    index: true,
  },
  provider: {
    type: String,
    default: "chapa",
  },
  checkoutUrl: {
    type: String,
    default: null,
  },
  chapaReference: {
    type: String,
    default: null,
  },
  prepayId: {
    type: String,
    default: null,
  },
  telebirrTransactionNo: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Transaction", TransactionSchema);

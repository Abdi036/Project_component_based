import asyncHandler from "../middleware/async.js";
import ErrorResponse from "../utils/errorResponse.js";
import payment from "../config/payment.js";
import { createTxRef, splitName } from "../utils/paymentHelpers.js";
import { findApplicableCampaign } from "../services/campaignService.js";
import {
  verifyWithChapa,
  initializePaymentWithChapa,
  creditTransactionTokens,
  syncTransactionState,
} from "../services/chapaService.js";
import Transaction from "../models/Transaction.js";
import User from "auth/src/models/userModel.js";
import PricingPlan from "../models/PricingPlan.js";

/**
 * @desc    Create a new payment order
 * @route   POST /api/v1/payment/create-order
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res, next) => {
  if (!payment.secretKey) {
    return next(new ErrorResponse("Chapa secret key is not configured.", 500));
  }

  const { tierId, phone_number } = req.body;
  const plan = await PricingPlan.findById(tierId);

  if (!plan || !plan.isPublished) {
    return next(
      new ErrorResponse("Selected pricing plan is not available.", 400),
    );
  }

  // Find applicable discount campaign
  const applicableCampaign = await findApplicableCampaign(req.user._id);
  const originalAmountBirr = Number(plan.priceBirr);
  const discountPercentage = applicableCampaign?.percentage || 0;
  const discountedAmountBirr = Math.max(
    Math.round(originalAmountBirr * (1 - discountPercentage / 100)),
    0,
  );

  // Create transaction reference
  const txRef = createTxRef();
  const { firstName, lastName } = splitName(req.user?.name);
  const callbackUrl = `${payment.callbackUrl}${payment.callbackUrl.includes("?") ? "&" : "?"}tx_ref=${encodeURIComponent(txRef)}`;
  const returnUrl = `${payment.returnUrl}${payment.returnUrl.includes("?") ? "&" : "?"}orderId=${encodeURIComponent(txRef)}`;

  // Prepare Chapa payment payload
  const payload = {
    amount: String(discountedAmountBirr),
    currency: payment.currency,
    email: req.user?.email,
    first_name: firstName,
    last_name: lastName,
    tx_ref: txRef,
    callback_url: callbackUrl,
    return_url: returnUrl,
    customization: {
      title: "AI Prep Tokens",
      description: `${plan.tokens} tokens package`,
    },
    meta: {
      tierId: String(plan._id),
      tokens: String(plan.tokens),
      userId: String(req.user._id),
      campaignCode: applicableCampaign?.code || "",
      discountPercentage: String(discountPercentage),
      hide_receipt: "true",
    },
  };

  if (phone_number) {
    payload.phone_number = String(phone_number);
  }

  // Initialize payment with Chapa
  let initializeResult;
  try {
    initializeResult = await initializePaymentWithChapa(payload);
  } catch (err) {
    const providerMessage = err?.response?.data?.message || err.message;
    console.error("Chapa initialize error:", providerMessage);
    return next(new ErrorResponse("Failed to initialize Chapa payment.", 502));
  }

  const checkoutUrl = initializeResult?.data?.checkout_url;
  if (!checkoutUrl) {
    console.error("Invalid Chapa initialize response:", initializeResult);
    return next(
      new ErrorResponse("Chapa returned an invalid checkout URL.", 502),
    );
  }

  // Create transaction record
  await Transaction.create({
    user: req.user._id,
    pricingPlan: plan._id,
    tierId: String(plan._id),
    tokens: plan.tokens,
    originalAmountBirr,
    amountBirr: discountedAmountBirr,
    campaignCode: applicableCampaign?.code || null,
    discountPercentage,
    firstPurchaseOnlyApplied: Boolean(applicableCampaign?.firstPurchaseOnly),
    merchantOrderId: txRef,
    txRef,
    provider: "chapa",
    checkoutUrl,
    status: "pending",
  });

  res.status(200).json({
    success: true,
    data: {
      merchantOrderId: txRef,
      txRef,
      toPayUrl: checkoutUrl,
      checkoutUrl,
      provider: "chapa",
      amountBirr: discountedAmountBirr,
      originalAmountBirr,
      discountPercentage,
      campaignCode: applicableCampaign?.code || null,
    },
  });
});

/**
 * @desc    Confirm test payment (disabled in production)
 * @route   POST /api/v1/payment/confirm-test-payment
 * @access  Private
 */
export const confirmTestPayment = asyncHandler(async (req, res) => {
  res.status(410).json({
    success: false,
    message: "Test payment confirmation is disabled. Use Chapa checkout flow.",
  });
});

/**
 * @desc    Handle payment notification from Chapa webhook
 * @route   POST /api/v1/payment/notify
 * @access  Public
 */
export const paymentNotify = asyncHandler(async (req, res) => {
  const txRef = req.body?.tx_ref || req.query?.tx_ref;
  if (!txRef) {
    return res.status(400).json({ success: false, message: "Missing tx_ref" });
  }

  const transaction = await Transaction.findOne({
    $or: [{ txRef }, { merchantOrderId: txRef }],
  });

  if (!transaction) {
    return res
      .status(404)
      .json({ success: false, message: "Transaction not found" });
  }

  try {
    await syncTransactionState(transaction);
  } catch (err) {
    const providerMessage = err?.response?.data?.message || err.message;
    console.error("Chapa notify verify error:", providerMessage);
    return res
      .status(502)
      .json({ success: false, message: "Verification failed" });
  }

  return res.status(200).json({
    success: true,
    data: {
      txRef: transaction.txRef || transaction.merchantOrderId,
      status: transaction.status,
    },
  });
});

/**
 * @desc    Verify payment status
 * @route   GET /api/v1/payment/verify/:orderId
 * @access  Private
 */
export const verifyPayment = asyncHandler(async (req, res, next) => {
  const transaction = await Transaction.findOne({
    merchantOrderId: req.params.orderId,
    user: req.user._id,
  });

  if (!transaction) {
    return next(new ErrorResponse("Transaction not found", 404));
  }

  try {
    await syncTransactionState(transaction);
  } catch (err) {
    const providerMessage = err?.response?.data?.message || err.message;
    console.error("Chapa verify error:", providerMessage);
  }

  res.status(200).json({
    success: true,
    data: {
      status: transaction.status,
      tokens: transaction.tokens,
      amountBirr: transaction.amountBirr,
      originalAmountBirr: transaction.originalAmountBirr,
      discountPercentage: transaction.discountPercentage,
      campaignCode: transaction.campaignCode,
      completedAt: transaction.completedAt,
      txRef: transaction.txRef || transaction.merchantOrderId,
    },
  });
});

/**
 * @desc    Get user's purchase history
 * @route   GET /api/v1/payment/history
 * @access  Private
 */
export const getMyTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("pricingPlan", "name tokens priceBirr");

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions,
  });
});

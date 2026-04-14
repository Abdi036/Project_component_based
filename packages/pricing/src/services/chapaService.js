import axios from "axios";
import payment from "../config/payment.js";
import { normalizeStatus } from "../utils/paymentHelpers.js";
import Transaction from "../models/Transaction.js";
import User from "auth/src/models/userModel.js";
import DiscountCampaign from "../models/DiscountCampaign.js";
import { createPaymentStatusNotification } from "../utils/notificationEvents.js";

const chapaAxios = axios.create({
  baseURL: payment.baseUrl,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Verify transaction with Chapa provider
export async function verifyWithChapa(txRef) {
  const { data } = await chapaAxios.get(
    `/transaction/verify/${encodeURIComponent(txRef)}`,
    {
      headers: {
        Authorization: `Bearer ${payment.secretKey}`,
      },
    },
  );
  return data;
}

// Initialize payment with Chapa
export async function initializePaymentWithChapa(payload) {
  const { data } = await chapaAxios.post("/transaction/initialize", payload, {
    headers: {
      Authorization: `Bearer ${payment.secretKey}`,
    },
  });
  return data;
}

// Credit tokens to user when payment completes
export async function creditTransactionTokens(transaction, chapaData) {
  if (transaction.status === "completed") {
    return transaction;
  }

  transaction.status = "completed";
  transaction.completedAt = new Date();
  transaction.chapaReference =
    chapaData?.reference || chapaData?.ref_id || null;
  transaction.telebirrTransactionNo = transaction.chapaReference;
  await transaction.save();

  // Add tokens to user balance
  await User.findByIdAndUpdate(transaction.user, {
    $inc: { token: transaction.tokens },
  });

  // Update campaign redemption count
  if (transaction.campaignCode) {
    await DiscountCampaign.findOneAndUpdate(
      { code: transaction.campaignCode },
      { $inc: { redemptions: 1 } },
    );
  }

  // Send notification
  await createPaymentStatusNotification(transaction, "completed");

  return transaction;
}

// Sync transaction state with Chapa provider
export async function syncTransactionState(transaction) {
  if (transaction.status === "completed") {
    return transaction;
  }

  const chapaResult = await verifyWithChapa(
    transaction.txRef || transaction.merchantOrderId,
  );
  const chapaData = chapaResult?.data || {};
  const finalStatus = normalizeStatus(chapaData.status || chapaResult?.status);

  if (finalStatus === "completed") {
    await creditTransactionTokens(transaction, chapaData);
  } else if (finalStatus === "failed") {
    transaction.status = "failed";
    transaction.chapaReference =
      chapaData?.reference || chapaData?.ref_id || null;
    await transaction.save();
    await createPaymentStatusNotification(transaction, "failed");
  }

  return transaction;
}

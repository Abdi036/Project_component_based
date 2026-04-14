import DiscountCampaign from "../models/DiscountCampaign.js";
import Transaction from "../models/Transaction.js";
import { isCampaignInWindow } from "../utils/paymentHelpers.js";

// Find applicable discount campaign for user
export async function findApplicableCampaign(userId) {
  const campaigns = await DiscountCampaign.find({ isActive: true }).sort({
    percentage: -1,
    createdAt: -1,
  });

  const campaignsInWindow = campaigns.filter((campaign) =>
    isCampaignInWindow(campaign),
  );
  if (campaignsInWindow.length === 0) {
    return null;
  }

  const completedCount = await Transaction.countDocuments({
    user: userId,
    status: "completed",
  });

  for (const campaign of campaignsInWindow) {
    if (campaign.firstPurchaseOnly && completedCount > 0) {
      continue;
    }
    return campaign;
  }

  return null;
}
